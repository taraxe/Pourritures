package models

import org.joda.time.DateTime
import play.api.libs.json._
import scala.concurrent.Future
import reactivemongo.bson._
import play.modules.reactivemongo._
import play.api.Logger
import scala.concurrent.duration._

/**
 * User: ala
 * Date: 22/05/13
 * Time: 15:48
 */

case class Pourri(_id:Option[BSONObjectID] = None, nom:String, prenom:String, formation:Formation.Formation, ex:Option[Boolean], gouvernement:Option[Boolean]) {

  import scala.concurrent.{Await, duration}

  def fullname = prenom + " " + nom
  val slug = Pourri.slugify(fullname)

  def affaires:Future[Seq[Affaire]] = {
    import scala.concurrent.ExecutionContext.Implicits.global
    this._id.map(Affaire.byPid).getOrElse(Future(Nil))
  }
  def affairesBlockin:Seq[Affaire] = Await.result(affaires,1 second)

}
case class Affaire(id:Option[BSONObjectID] = None,
                   pid:Option[BSONObjectID],
                   annee:DateTime,
                   typeAffaire:TypeAffaire.TypeAffaire,
                   amende:Option[Int],
                   infractions:Seq[String],
                   source:Option[String],
                   checked:Boolean,
                   approvalCount:Option[Int] = None,
                   deleted:Option[Boolean] = None,
                   natures:Set[Droits.Value] = Set.empty)

object Formation extends Enumeration {
  type Formation = Value
  val PCF = Value("pcf")
  val FdG= Value("fdg")
  val Verts=Value("eelv")
  val PS = Value("ps")
  val UMP = Value("ump")
  val FN = Value("fn")
  val UDI = Value("udi")
  implicit val jsonFormat = new Format[Formation] {
    def reads(json: JsValue) = JsSuccess(Formation.withName(json.as[String]))
    def writes(o: Formation.Formation) = JsString(o.toString)
  }
}

object TypeAffaire extends Enumeration {
  type TypeAffaire = Value
  val condamnation = Value("condamnation")
  val examen = Value("mise en examen")
  implicit val jsonFormat = new Format[TypeAffaire] {
    def reads(json: JsValue) = JsSuccess(TypeAffaire.withName(json.as[String]))
    def writes(o: TypeAffaire.TypeAffaire) = JsString(o.toString)
  }
}

object Droits extends Enumeration {
  type Droits = Value

  val civil = Value("c")
  val proprieteIntellectuelle = Value("dpi")
  val travail = Value("dt")
  val fiscal = Value("df")
  val electoral = Value("de")
  val procedurePenale = Value("pp")
  val penalGeneral = Value("dpg")
  val affaires = Value("da")
  val indetermine = Value("")

  implicit val jsonFormat = new Format[Droits] {
    def reads(json: JsValue) = JsSuccess(Droits.withName(json.as[String]))
    def writes(o: Droits.Droits) = JsString(o.toString)
  }
}

object Pourri extends MongoDAO {
  import play.modules.reactivemongo.json.collection.JSONCollection
  implicit val pourriJsonFormat = Format(Json.reads[Pourri], new Writes[Pourri] {
    val tjs: Writes[Pourri] = Json.writes[Pourri]
    def writes(o: Pourri):JsObject = Json.toJson(o)(tjs).as[JsObject] ++ Json.obj("slug" -> Pourri.slugify(o.fullname))
  })
  val collection = db.collection[JSONCollection]("pourris")
  def bySlug(slug:String) = find[Pourri](Json.obj("slug"->slug)).headOption
  def all = Pourri.find(Json.obj()).toList
  def withAffaires:Future[List[Pourri]] = Affaire.allChecked.flatMap{ ids =>
    val toFind = ids.map(_.pid).collect {
      case Some(id) => id
    }
    Pourri.find(Json.obj("_id"->Json.obj("$in"-> Json.toJson(toFind)))).toList
  }

  def slugify(str:String):String = {
    import java.util.regex.Pattern
    import java.text.Normalizer
    val s = org.apache.commons.lang3.StringUtils.defaultString(str)
    val nfdNormalizedString = Normalizer.normalize(s, Normalizer.Form.NFD)
    val pattern = Pattern.compile("""\p{InCombiningDiacriticalMarks}+""")
    pattern.matcher(nfdNormalizedString).replaceAll("").replaceAll(" ","-").toLowerCase
  }
}
object Affaire extends MongoDAO {
  import play.modules.reactivemongo.json.collection.JSONCollection
  import play.api.libs.functional.syntax._
  import play.api.libs.json.util._
  import play.api.libs.json.Writes._
  import play.api.libs.json.Reads._

  implicit val mongoReads:Reads[Affaire] = (
      (__ \ "_id").readNullable[BSONObjectID] and
      (__ \ "pid").readNullable[BSONObjectID] and
      (__ \ "annee").read[DateTime] and
      (__ \ "typeAffaire").read[TypeAffaire.TypeAffaire] and
      (__ \ "amende").readNullable[Int] and
      (__ \ "infractions").read[Seq[String]] and
      (__ \ "source").readNullable[String] and
      (__ \ "checked").read[Boolean] and
      (__ \ "approvalCount").readNullable[Int] and
      (__ \ "deleted").readNullable[Boolean] and
      (__ \ "natures").readNullable(traversableReads[Set, Droits.Value]).map{ _.getOrElse(Set.empty)}
    )(Affaire.apply _)

  implicit val mongoWrites:Writes[Affaire] = (
      (__ \ "_id").writeNullable[BSONObjectID] and
      (__ \ "pid").writeNullable[BSONObjectID] and
      (__ \ "annee").write[DateTime] and
      (__ \ "typeAffaire").write[TypeAffaire.TypeAffaire] and
      (__ \ "amende").writeNullable[Int] and
      (__ \ "infractions").write(traversableWrites[String]) and
      (__ \ "source").writeNullable[String] and
      (__ \ "checked").write[Boolean] and
      (__ \ "approvalCount").writeNullable[Int] and
      (__ \ "deleted").writeNullable[Boolean] and
      (__ \ "natures").write(traversableWrites[Droits.Value])
    )(unlift(Affaire.unapply))

  val collection = db.collection[JSONCollection]("affaires")
  val alivesQuery = Json.obj("deleted"->Json.obj("$ne"->true), "typeAffaire"->TypeAffaire.condamnation.toString)
  def alives(js:JsObject,sort:JsObject = Json.obj()) = find[Affaire](alivesQuery ++ js, sort)
  def byPid(id:BSONObjectID) = find[Affaire](Json.obj("pid"->id)).toList
  def byId(id:BSONObjectID):Future[Option[Affaire]] = find[Affaire](Json.obj("_id"-> Json.toJson(id))).headOption
  def byId(id:String):Future[Option[Affaire]] = byId(BSONObjectID(id))

  def uncategorized:Future[List[Affaire]] = find[Affaire](Json.obj("natures" -> Json.arr())).toList
  def allChecked:Future[List[Affaire]] = alives(Json.obj("checked"->true)).toList // how to get only pid field
  def allUnchecked:Future[List[Affaire]] = alives(Json.obj("checked"->false),Json.obj("_id" -> -1)).toList
}
