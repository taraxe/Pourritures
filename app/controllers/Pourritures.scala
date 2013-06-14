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


  implicit val app = play.api.Play.current

  def index = Action(Ok(views.html.index()))

  def contrib(slug:Option[String]) = Action(Async(
    Pourri.all.map(lp => Ok(views.html.contrib(lp, slug)))
  ))

  def show(slug: String) = Action{
    Async(
      for {
        p <- Pourri.bySlug(slug)
        a <- p.map(_.affaires).getOrElse(Future(Nil))
        all <- Pourri.withAffaires
      } yield {
        p match {
          case None => NotFound(views.html.contrib(all)) // todo add flasing
          case Some(p) => Ok(views.html.show(p,a))
        }
      }
    )
  }
  def showFragment(slug: String) = Action{
    Async(
      for {
        p <- Pourri.bySlug(slug)
        a <- p.map(_.affaires).getOrElse(Future(Nil))
      } yield {
        p match {
          case None => NotFound("")
          case Some(p) => Ok(views.html.parts.pourri(p,a))
        }
      }
    )
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

  val affaireForm:Form[Affaire] = Form(mapping(
      "annee" -> number(min = 1900, max = new DateTime().year().get()),
      "nature" -> number(min = 0, max = TypeAffaire.maxId),
      "amende" -> optional(number(min = 1)),
      "raisons" -> nonEmptyText,
      "source" -> nonEmptyText
    )((year: Int, typeAffaireNb: Int, amende: Option[Int], raisons: String, source: String) => Affaire(None, None, new DateTime().withYear(year), TypeAffaire(typeAffaireNb), amende, raisons.split(",").map(_.trim), Some(source), false))
      ((a: Affaire) => Some(a.annee.year().get(), a.typeAffaire.id, a.amende, a.raisons.mkString(", "), a.source.getOrElse("")))
    )


  def create() = Action { implicit request =>
    import play.api.libs.json.Json
    Async(pourriForm.bindFromRequest().fold(
      err => Future(BadRequest(err.errorsAsJson)),
      p => Pourri.bySlug(Pourri.slugify(p.fullname)).flatMap {
        case None => Pourri.insert(p).map {_ =>
            Ok(Json.toJson(p))
        }
        case Some(p) => Future(Ok(Json.toJson(p)))
      }
    ))
  }

  def createAffaire(slug:String) = Action { implicit request =>
    import play.api.libs.json.Json
    Async(
      Pourri.bySlug(slug).flatMap {
        case Some(p) => affaireForm.bindFromRequest().fold(
          err => Future(BadRequest(Json.toJson(err.errorsAsJson))),
          newAffaire => Affaire.insert(newAffaire.copy(pid = p._id)).map(_ => Ok(Json.toJson(p)))
        )
        case None => Future(NotFound(""))
      }
    )
  }

/*
  def voteAffaire() = Action { implicit request =>
    Ok("")
  }
*/

  def javascriptRoutes = Action { implicit request =>
    Ok(
      Routes.javascriptRouter("jsRoutes")(
        routes.javascript.Pourritures.index,
        routes.javascript.Pourritures.show,
        routes.javascript.Pourritures.showFragment,
        routes.javascript.Pourritures.contrib
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
                        "raison" -> Json.toJson(o.raisons),
                        "nature" -> Json.toJson(o.typeAffaire.toString),
                        "annee" -> Json.toJson(o.annee.getYear)
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