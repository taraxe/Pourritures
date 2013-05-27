package controllers

import play.api._
import play.api.data.Form._
import play.api.data.Forms._

import play.api.mvc._
import models.{Formation, TypeAffaire, Affaire, Pourri}
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.data.Form
import org.joda.time.DateTime

object Application extends Controller {
  implicit val app = play.api.Play.current

  def index = Action(Ok(views.html.index()))

  def search(name: Option[String] = None) = Action {
    (for (n <- name) yield {
      Async(
        for (fop <- Pourri.bySlug(n)) yield {
          Ok(views.html.find(fop))
        }
      )
    }).getOrElse(Ok(views.html.find()))
  }

  def find(slug: String) = Action{
    Async(
      Pourri.bySlug(slug).map{ _ match {
        case None => NotFound(views.html.find())
        case p => Ok(views.html.find(p))
      }}
    )
  }

  val form: Form[Pourri] = Form(mapping(
    "nom" -> nonEmptyText,
    "prenom" -> nonEmptyText,
    "formation" -> number(min = 0, max = Formation.maxId),
    "ex" -> optional(boolean),
    "gouvernement" -> optional(boolean),
    "affaires" -> seq(mapping(
      "annee" -> number(max = new DateTime().year().get()),
      "type" -> number(min = 0, max = TypeAffaire.maxId),
      "amende" -> optional(number(min = 1)),
      "raisons" -> seq(nonEmptyText),
      "source" -> nonEmptyText
    )((year: Int, typeAffaireNb: Int, amende: Option[Int], raisons: Seq[String], source: String) => Affaire(new DateTime().withYear(year), TypeAffaire(typeAffaireNb), amende, raisons, Some(source), false))
     ((a: Affaire) => Some(a.annee.year().get(), a.typeAffaire.id, a.amende, a.raisons, a.source.getOrElse("")))
    )
  )((nom: String, prenom: String, formation: Int, ex: Option[Boolean], gouv: Option[Boolean], affaires: Seq[Affaire]) => Pourri(None, nom, prenom, Formation(formation), ex, gouv, affaires))
    ((p: Pourri) => Some(p.nom, p.prenom, p.formation.id, p.ex, p.gouvernement, p.affaires))
  )


  def create() = Action {
    Ok(views.html.create(form))
  }

  def doCreate() = Action { implicit request =>
    form.bindFromRequest().fold(
      err => BadRequest(views.html.create(err)),
      newPourri => {
        Pourri.insert(newPourri)
        Redirect(routes.Application.find(newPourri.slug))
      }
    )
  }

}