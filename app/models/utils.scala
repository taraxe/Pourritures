package models

trait MongoDAO {

  import play.modules.reactivemongo._
  import play.api.Play.current
  import scala.concurrent.{Future, ExecutionContext}
  import play.modules.reactivemongo.json.collection.JSONCollection
  import reactivemongo.bson._
  import play.api.libs.json._

  implicit val objectIdFormat = OFormat[BSONObjectID](
    (__ \ "$oid").read[String].map( obj => BSONObjectID(obj) ),
    OWrites[BSONObjectID](s => Json.obj("$oid" -> s.stringify))
  )

  def driver = ReactiveMongoPlugin.driver
  def connection = ReactiveMongoPlugin.connection
  def db = ReactiveMongoPlugin.db
  def collection:JSONCollection
  implicit def ec: ExecutionContext = ExecutionContext.Implicits.global

  def save[T](e:T)(implicit w:Writes[T]):Future[T] = collection.save(e).map{lastErr =>
    import play.api.Logger
    Logger.debug("Mongo Last Error: %s".format(lastErr))
    e
  }

  def insert[T](e:T)(implicit w:Writes[T]):Future[T] = collection.insert(e).map { lastErr =>
      import play.api.Logger
      Logger.debug("Mongo Last Error: %s".format(lastErr))
      e
  }

  def find[T](js:JsObject)(implicit f:Format[T]):Future[Seq[T]] =
    collection.find(js).cursor[JsObject].toList().map(_.map(f.reads(_).get))
}
