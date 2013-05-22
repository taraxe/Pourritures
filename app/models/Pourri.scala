package models

import reactivemongo.bson._
import org.joda.time.DateTime
import play.api.libs.json._

/**
 * User: ala
 * Date: 22/05/13
 * Time: 15:48
 */

case class Pourri(_id:Option[BSONObjectID] = None, name:String, formation:Formation.Formation, ex:Option[Boolean], gouvernement:Option[Boolean], affaires:Seq[Affaire])
case class Affaire(annee:DateTime, typeAffaire:TypeAffaire.TypeAffaire, amende:Option[Int], raisons:Seq[String])

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
  implicit val affaireJsonFormat = Json.format[Affaire]
  implicit val pourriJsonFormat = Json.format[Pourri]
  implicit val affairesWrite = play.api.libs.json.Writes.traversableWrites[Affaire]
  implicit val affairesRead = play.api.libs.json.Reads.traversableReads[Seq,Affaire]
  val collection = db.collection[JSONCollection]("pourris")
  def byName(name:String) = find[Pourri](Json.obj("name"->name)).map(_.headOption)
}