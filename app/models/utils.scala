package models

trait MongoDAO {

  import play.modules.reactivemongo._
  import play.api.Play.current
  import scala.concurrent.{Future, ExecutionContext}
  import play.modules.reactivemongo.json.collection.JSONCollection
  import reactivemongo.bson._
  import play.api.libs.json._
  import reactivemongo.core.commands.{Count, LastError}
  import reactivemongo.api._

  implicit val oidReads = (__ \ "$oid").read[String].map(obj => BSONObjectID(obj))
  implicit val oidWrites = OWrites[BSONObjectID](s => Json.obj("$oid" -> s.stringify))

  def driver = ReactiveMongoPlugin.driver
  def connection = ReactiveMongoPlugin.connection
  def db = ReactiveMongoPlugin.db
  def collection:JSONCollection
  implicit def ec: ExecutionContext = ExecutionContext.Implicits.global

  def save[T](e:T)(implicit w:Writes[T]):Future[T] = collection.save(e).map(handleError).map(_ => e)

  def insert[T](e:T)(implicit w:Writes[T]):Future[T] = collection.insert(e).map(handleError).map(_ => e)

  def handleError(error:LastError):Either[LastError, BSONDocument] = {
      error match {
        case LastError(true, _, _, _, Some(doc), _, _) => Right(doc)
        case LastError(false, Some(err), code, errorMsg, _, _, _) => {
          import play.api.Logger
          val message = """Error : %s \n
                           Error code: %d \n
                           Error message: %s""".format(err, code, errorMsg)
          Logger.error(message)
          Left(error)
        }
    }
  }


  def find[T](js:JsObject, sort:JsObject=Json.obj())(implicit f:Format[T]):Cursor[T] = collection.find(js).sort(sort).cursor[T]
  def count(/*js:Option[JsObject]*/):Future[Int] = db.command(Count(collection.name))
}

object MongoUtils {
  import reactivemongo.core.commands.LastError
  import play.api.libs.json._

  implicit def lastErrorAsJson(l:LastError):JsObject = l match {
    case LastError(true, _, _, _, Some(doc), _, _) => import play.api.libs.json.Json
      Json.obj()
    case LastError(false, Some(err), code, errorMsg, _, _, _) => Json.obj("error"-> err, "code"->code, "message"->errorMsg)
  }
}