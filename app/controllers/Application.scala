package controllers

import play.api._
import play.api.data.Form._
import play.api.data.Forms._

import play.api.mvc._
import models.{Affaire, Pourri}
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.data.Form
import java.util.{GregorianCalendar, Date}

object Application extends Controller {
  implicit val app = play.api.Play.current

  def index = Action {
    Ok(views.html.index())
  }

  def search(name:Option[String] = None) = Action {
    (for (n <- name) yield {
      Async(
        for (fop <- Pourri.byName(n)) yield {
          Ok(views.html.find(fop))
        }
      )
    }).getOrElse(Ok(views.html.find()))
  }

  def find(name:String) = search(Some(name))

  val form:Form[Pourri] = form(mapping(
    "nom" -> nonEmptyText,
    "prenom" -> nonEmptyText,
    "formation" -> optional(boolean),
    "ex" -> optional(boolean),
    "affaires" -> seq(mapping(
      "annee" -> number(max = new GregorianCalendar().get(9)), // FIX-ME use correct int for year
      "amende" -> optional(number(min = 1)),
      "raisons" -> seq(nonEmptyText)
    )(Affaire.apply)(Affaire.unapply)
  )(Pourri.apply)(Pourri.unapply))
  def create() = Action{
    Ok(views.html.create(form))
  }

}