package controllers

import play.api._
import play.api.mvc._
import models._
import scala.concurrent.ExecutionContext.Implicits.global

object BackOffice extends Controller with Authentication {

  import scala.io.Source

  val reviewersList:Set[String] = Source.fromFile("conf/reviewers").getLines().toSet
  implicit val app = play.api.Play.current

  val authentication = new AuthSettings {
    def CallbackUri(implicit request: RequestHeader) = routes.BackOffice.signinCallback().absoluteURL()

    override def signIn(userId: String, username: String)(result: Result)(implicit request: RequestHeader) = {
      Logger.debug(reviewersList.mkString)
      if (reviewersList.contains(username)) super.signIn(userId, username)(result)(request)
      else signOut(Redirect(routes.Pourritures.index()))

    }

    def onSuccess(implicit request: RequestHeader) = Redirect(routes.BackOffice.index())

    override def onUnauthorized(request: RequestHeader) = Redirect(routes.BackOffice.signin())
  }

  def index = validate

  def validate = Authenticated { implicit request =>
    Async(
      Affaire.allUnchecked.map{ a =>
        Ok(views.html.validate(a))
      }
    )
  }

  def doValidate(aid:String) = Authenticated{ implicit request =>
    import play.api.libs.json.Json
    Async(
      Affaire.byId(aid).map {
        case Some(a) => {
          Affaire.save(a.copy(checked = true))
          Ok(Json.toJson(a))
        }
      case None => NotFound(Json.obj("error"-> s"$aid not found"))
      }
    )
  }
  def unValidate(aid:String) = Authenticated{ implicit request =>
    import play.api.libs.json.Json
    Async(
      Affaire.byId(aid).map {
        case Some(a) => {
          Affaire.delete(a)
          Ok(Json.toJson(a))
        }
      case None => NotFound(Json.obj("error"-> s"$aid not found"))
      }
    )
  }

  val signOut = Action { implicit request =>
    authentication.signOut(Redirect(routes.Pourritures.index()))
  }


}