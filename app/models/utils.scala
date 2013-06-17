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

  implicit val objectIdFormat = OFormat[BSONObjectID](
    (__ \ "$oid").read[String].map(obj => BSONObjectID(obj)),
    OWrites[BSONObjectID](s => Json.obj("$oid" -> s.stringify))
    )

  def driver = ReactiveMongoPlugin.driver
  def connection = ReactiveMongoPlugin.connection
  def db = ReactiveMongoPlugin.db
  def collection:JSONCollection
  implicit def ec: ExecutionContext = ExecutionContext.Implicits.global

  def save[T](e:T)(implicit w:Writes[T]):Future[T] = collection.save(e).map(log).map(_ => e)

  def insert[T](e:T)(implicit w:Writes[T]):Future[T] = collection.insert(e).map(log).map(_ => e)

  def log(err:LastError) {
    if(err.inError){
      import play.api.Logger
      Logger.error("Mongo Last Error: %s".format(err))
    }
  }

  def find[T](js:JsObject, sort:JsObject=Json.obj())(implicit f:Format[T]):Cursor[T] = collection.find(js).sort(sort).cursor[T]
  def count(/*js:Option[JsObject]*/):Future[Int] = db.command(Count(collection.name))
}
