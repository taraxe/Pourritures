package controllers

import play.api._

import play.api.mvc._
import _root_.models._
import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global
import play.api.data.Forms._
import play.api.data.Form
import org.joda.time.DateTime

object BackOffice extends Controller with Authentication {


  implicit val app = play.api.Play.current

  val authentication = new AuthSettings {

    def CallbackUri(implicit request: RequestHeader) = routes.BackOffice.signinCallback().absoluteURL()


    override def signIn(userId: String, username: String)(result: Result)(implicit request: RequestHeader) = {
      if (username == "antoine.labbe@gmail.com") super.signIn(userId, username)(result)(request)
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

  val signOut = Action { implicit request =>
    authentication.signOut(Redirect(routes.Pourritures.index()))
  }


}