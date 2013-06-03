package models

import org.joda.time.DateTime
import play.api.libs.json._
import scala.concurrent.Future
import reactivemongo.bson._
import play.modules.reactivemongo._
import play.api.Logger

/**
 * User: ala
 * Date: 22/05/13
 * Time: 15:48
 */

case class Pourri(_id:Option[BSONObjectID] = None, nom:String, prenom:String, formation:Formation.Formation, ex:Option[Boolean], gouvernement:Option[Boolean]) {

  def fullname = prenom + " " + nom
  val slug = Pourri.slugFromString(fullname)

  def affaires:Future[Seq[Affaire]] = {
    import scala.concurrent.ExecutionContext.Implicits.global
    this._id.map(Affaire.byPid).getOrElse(Future(Nil))
  }

}
case class Affaire(_id:Option[BSONObjectID] = None, pid:Option[BSONObjectID], annee:DateTime, typeAffaire:TypeAffaire.TypeAffaire, amende:Option[Int], raisons:Seq[String], source:Option[String], checked:Boolean, approvalCount:Option[Int] = None)

object Formation extends Enumeration {
  type Formation = Value
  val FdG, Verts, PS, UMP, FN, UDI = Value
  implicit val jsonFormat = new Format[Formation] {
    def reads(json: JsValue) = JsSuccess(Formation(json.as[Int]))
    def writes(o: Formation.Formation) = JsNumber(o.id)
  }
}

object TypeAffaire extends Enumeration {
  type TypeAffaire = Value
  val condamnation, examen = Value
  implicit val jsonFormat = new Format[TypeAffaire] {
    def reads(json: JsValue) = JsSuccess(TypeAffaire(json.as[Int]))
    def writes(o: TypeAffaire.TypeAffaire) = JsNumber(o.id)
  }
}


object Pourri extends MongoDAO {
  import play.modules.reactivemongo.json.collection.JSONCollection
  implicit val pourriJsonFormat = Format(Json.reads[Pourri], new Writes[Pourri] {
    val tjs: Writes[Pourri] = Json.writes[Pourri]
    def writes(o: Pourri):JsObject = Json.toJson(o)(tjs).as[JsObject] ++ Json.obj("slug" -> Pourri.slugFromString(o.fullname))
  })
  val collection = db.collection[JSONCollection]("pourris")
  def bySlug(slug:String) = find[Pourri](Json.obj("slug"->slug)).headOption
  def withAffaires:Future[List[Pourri]] = Affaire.pourriIds.flatMap{ ids =>
    val toFind = ids.map(_.pid).collect {
      case Some(id) => id
    }
    Pourri.find(Json.obj("_id"->Json.obj("$in"-> Json.toJson(toFind)))).toList
  }

  def slugFromString(str:String):String = {
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

  implicit val affaireJsonFormat = Json.format[Affaire]
  implicit val affairesWrite = play.api.libs.json.Writes.traversableWrites[Affaire]
  implicit val affairesRead = play.api.libs.json.Reads.traversableReads[Seq,Affaire]
  val collection = db.collection[JSONCollection]("affaires")
  def byPid(id:BSONObjectID) = find[Affaire](Json.obj("pid"->id)).toList
  def byId(id:BSONObjectID):Future[Option[Affaire]] = find[Affaire](Json.obj("_id"->Json.toJson(id))).headOption
  //def incrementApprovalCountForId(id:BSONObjectID)
  def pourriIds:Future[List[Affaire]] = find[Affaire](Json.obj()).toList // how to get only pid field
  def checkedPourriIds:Future[List[Affaire]] = find[Affaire](Json.obj("checked"->true)).toList // how to get only pid field
  //def pourriIds = collection.find(Json.obj(), Json.obj("pid"->1)).cursor[BSONObjectID](objectIdReads,ec).toList() // how to get only pid field

}
