package controllers

import play.api.mvc._

object BackOffice extends Controller {


  implicit val app = play.api.Play.current

  def index = Action{ implicit request =>
    (Ok(views.html.index()))
  }

}