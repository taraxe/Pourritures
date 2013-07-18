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

  def categorize = Authenticated { implicit request =>
    Async(
      Affaire.uncategorized.map { r =>
        Ok(views.html.category(r))
      }
    )
  }
  import play.api.libs.json._
  import play.api.libs.json.Reads._
  import play.api.libs.functional.syntax._

  val emptyObj = __.json.put(Json.obj())
  val validateNatures = Reads.verifyingIf( (x:JsArray) => x.value.nonEmpty)(Reads.list[String])
  val naturesOrEmptyArray = ((__ \ 'natures).json.pick[JsArray] orElse Reads.pure(Json.arr())) andThen validateNatures
  val natureValidate = (__ \ "natures").json.copyFrom(naturesOrEmptyArray)
  val affaireValidate:Reads[JsObject] = {
    (
      ((__ \ "checked").json.pickBranch or emptyObj) and
      ((__ \ "deleted").json.pickBranch or emptyObj) and
      natureValidate
      ).reduce
  }
  val toObjectId = OWrites[String]{ s => Json.obj("_id" -> Json.obj("$oid" -> s)) }


  def update(aid:String) = Authenticated(parse.json){ implicit request =>
    val toMongoUpdate = (__ \ '$set).json.copyFrom( __.json.pick )
    request.body.transform(affaireValidate).flatMap{ jsonAffaire =>
      jsonAffaire.transform(toMongoUpdate).map {updateSelector =>
        Async(
          Affaire.collection.update(toObjectId.writes(aid), updateSelector).map {
            case lastError if lastError.ok => Ok(jsonAffaire)
            case err => InternalServerError(MongoUtils.lastErrorAsJson(err))
          }
        )
      }
    }.recoverTotal{ e =>
      BadRequest( JsError.toFlatJson(e))
    }
  }

  def addCategory(aid:String)= Authenticated(parse.json){ implicit request =>
    val toMongoAddToSet = (__ \ '$addToSet \ 'natures \ '$each).json.copyFrom((__ \ "natures").json.pick[JsArray])
    request.body.transform(natureValidate).flatMap{ jsonAffaire =>
      jsonAffaire.transform(toMongoAddToSet).map { updateSelector =>
        Async(
          Affaire.collection.update(toObjectId.writes(aid), updateSelector).map {
            case lastError if lastError.ok => Ok(jsonAffaire)
            case err => InternalServerError(MongoUtils.lastErrorAsJson(err))
          }
        )
      }
    }.recoverTotal{ e =>
      BadRequest( JsError.toFlatJson(e) )
    }
  }

  val signOut = Action { implicit request =>
    authentication.signOut(Redirect(routes.Pourritures.index()))
  }


}