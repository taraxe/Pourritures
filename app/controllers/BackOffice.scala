package controllers

import play.api._

import play.api.mvc._
import _root_.models._
import scala.concurrent.Future

import scala.concurrent.ExecutionContext.Implicits.global
import play.api.data.Forms._
import play.api.data.Form
import org.joda.time.DateTime

object BackOffice extends Controller {


  implicit val app = play.api.Play.current

  def index = Action(Ok(views.html.index()))

}