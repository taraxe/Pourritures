package controllers

import play.api._

import play.api.mvc._
import _root_.models._
import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global
import play.api.data.Forms._
import play.api.data.Form
import org.joda.time.DateTime

object Pourritures extends Controller {

  import java.net.{URL, MalformedURLException}


  implicit val app = play.api.Play.current

  def index = Action(Ok(views.html.index()))

  def search = doContrib(None)
  def contrib(slug:String) = doContrib(Some(slug))
  def doContrib(slug:Option[String]) = Action(Async(
    Pourri.all.flatMap { all =>
        slug.map { s =>
            Pourri.bySlug(s).map(p => Ok(views.html.contrib(all, p)))
        }.getOrElse(Future(Ok(views.html.contrib(all, None))))
    }
  ))

  def show(slug: String) = Action{
    Async(
      for {
        p <- Pourri.bySlug(slug)
        a <- p.map(_.affaires).getOrElse(Future(Nil))
        all <- Pourri.withAffaires
      } yield {
        p match {
          case None => NotFound(views.html.contrib(all))
          case Some(p) => Ok(views.html.show(p,a))
        }
      }
    )
  }

  def captchaForm(implicit request:RequestHeader) = {
  import views.ReCaptcha
  Form[(String, String)](
    tuple(
      "recaptcha_challenge_field" -> nonEmptyText,
      "recaptcha_response_field" -> nonEmptyText
    ) verifying("captcha.challenge_field", a => ReCaptcha.check(request.uri, a._1, a._2)))
  }

  val pourriForm: Form[Pourri] = Form(mapping(
    "nom" -> nonEmptyText,
    "prenom" -> nonEmptyText,
    "formation" -> number(min = 0, max = Formation.maxId),
    "ex" -> optional(boolean),
    "gouvernement" -> optional(boolean)
  )((nom: String, prenom: String, formation: Int, ex: Option[Boolean], gouv: Option[Boolean]) => Pourri(None, nom, prenom, Formation(formation), ex, gouv))
    ((p: Pourri) => Some(p.nom, p.prenom, p.formation.id, p.ex, p.gouvernement))
  )

  import scala.util.control.Exception._
  val affaireForm:Form[Affaire] = {
    import play.api.libs.ws.WS
    import scala.concurrent.Await
    import scala.concurrent.duration._
    import java.net.ConnectException

    Form(mapping(
      "annee" -> number(min = 1900, max = new DateTime().year().get()),
      "nature" -> number(min = 0, max = TypeAffaire.maxId),
      "amende" -> optional(number(min = 1)),
      "infractions" -> nonEmptyText,
      "source" -> nonEmptyText.verifying{ s =>
        (for {
          url <- catching(classOf[MalformedURLException]) opt new URL(s)
          status <- catching(classOf[ConnectException]) opt Await.result(WS.url(url.toString).get(),2 seconds).status
          if (status >= 200 && status < 300 || status == 304)
        } yield {
          true
        }) match {
          case Some(x) => true
          case None => false
        }
      }
    )((year: Int, typeAffaireNb: Int, amende: Option[Int], raisons: String, source: String) => Affaire(None, None, new DateTime().withYear(year), TypeAffaire(typeAffaireNb), amende, raisons.split(",").map(_.trim), Some(source), false))
      ((a: Affaire) => Some(a.annee.year().get(), a.typeAffaire.id, a.amende, a.infractions.mkString(", "), a.source.getOrElse("")))
    )
  }


  def create() = Action { implicit request =>
    import play.api.libs.json._
    Async(
        pourriForm.bindFromRequest().fold(
          err => Future(Left(err.errorsAsJson)),
          p => Pourri.bySlug(Pourri.slugify(p.fullname)).flatMap {
            case None => Pourri.insert(p).map {_ =>
              Right(Json.toJson(p))
            }
            case Some(p) => Future(Right(Json.toJson(p)))
          }
        ).map{ e =>
          val captcha = captchaForm.bindFromRequest().fold(
            err => Left(err.errorsAsJson),
            _ => Right("")
          )
          ((e,captcha) match {
            case (Left(js), Left(jsc)) => Left(js.as[JsObject] ++ jsc.as[JsObject])
            case (_,Left(jsc)) => Left(jsc)
            case (Left(js),_) => Left(js)
            case (Right(js),_) => Right(js)
          }).fold(err => BadRequest(err), s => Ok(s))
        }
    )
  }

  def createAffaire(slug:String) = Action { implicit request =>
  import play.api.libs.json.Json
    Async(
      Pourri.bySlug(slug).flatMap {
        case Some(p) => {
          affaireForm.bindFromRequest().fold(
            err => Future(Left(Json.toJson(err.errorsAsJson))),
            newAffaire => Affaire.insert(newAffaire.copy(pid = p._id)).map(_ => Right(Json.toJson(p)))
          ).map{ e =>
            val captcha = captchaForm.bindFromRequest().fold(
              err => Left(err.errorsAsJson),
              _ => Right("")
            )
            ((e,captcha) match {
              case (Left(js), Left(jsc)) => import play.api.libs.json.JsObject
                Left(js.as[JsObject] ++ jsc.as[JsObject])
              case (_,Left(jsc)) => Left(jsc)
              case (Left(js),_) => Left(js)
              case (Right(js),_) => Right(js)
            }).fold(err => BadRequest(err), s => Ok(s)) // add flashing
          }

        }
        case None => Future(NotFound(""))
      }
    )
  }

  def javascriptRoutes = Action { implicit request =>
    Ok(
      Routes.javascriptRouter("jsRoutes")(
        routes.javascript.Pourritures.index,
        routes.javascript.Pourritures.show,
        routes.javascript.Pourritures.contrib,
        routes.javascript.BackOffice.doValidate,
        routes.javascript.BackOffice.unValidate
      )
    ).as("text/javascript")
  }

  //json apis
  def pourrituresJson = Action { implicit request =>
      import play.api.libs.json._
      Async(
        Pourri.withAffaires.flatMap { la =>
            Future.sequence(la.map { p =>
                p.affaires.map(_.map { a =>
                    Json.toJson(a)(new Writes[Affaire] {
                      def writes(o: Affaire) = Json.obj(
                        "infractions" -> Json.toJson(o.infractions),
                        "type" -> Json.toJson(o.typeAffaire.toString),
                        "annee" -> Json.toJson(o.annee.getYear),
                        "natures" -> Json.toJson(o.natures)(Writes.traversableWrites(new Writes[NatureAffaire.NatureAffaire] {
                          def writes(o: NatureAffaire.NatureAffaire) = JsString(o.toString)
                        }))
                      )
                    }).as[JsObject] ++ Json.obj(
                      "name" -> p.fullname,
                      "slug" -> p.slug,
                      "formation"->p.formation.toString.toLowerCase,
                      "ex"-> Json.toJson(p.ex),
                      "gouvernement" -> Json.toJson(p.gouvernement)
                    )
                })
            }).map(_.flatten)
        }.map(r => Ok(Json.toJson(r)))
      )
  }
}