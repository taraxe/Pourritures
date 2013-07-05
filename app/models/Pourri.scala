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
case class Affaire(_id:Option[BSONObjectID] = None,
                   pid:Option[BSONObjectID],
                   annee:DateTime,
                   typeAffaire:TypeAffaire.TypeAffaire,
                   amende:Option[Int],
                   infractions:Seq[String],
                   source:Option[String],
                   checked:Boolean,
                   approvalCount:Option[Int] = None,
                   deleted:Option[Boolean] = None) {

  lazy val natures = NatureAffaire.readFromString(infractions)
}

object Formation extends Enumeration {
  type Formation = Value
  val PCF, FdG, Verts, PS, UMP, FN, UDI = Value
  implicit val jsonFormat = new Format[Formation] {
    def reads(json: JsValue) = JsSuccess(Formation(json.as[Int]))
    def writes(o: Formation.Formation) = JsNumber(o.id)
  }
  override def toString() = super.toString().toLowerCase()
}

object TypeAffaire extends Enumeration {
  type TypeAffaire = Value
  val condamnation = Value
  val examen = Value("mise en examen")
  implicit val jsonFormat = new Format[TypeAffaire] {
    def reads(json: JsValue) = JsSuccess(TypeAffaire(json.as[Int]))
    def writes(o: TypeAffaire.TypeAffaire) = JsNumber(o.id)
  }
}

object NatureAffaire extends Enumeration {
  type NatureAffaire = Value
  val sexuel, discrimination, economique, fiscal, diffamation, violence = Value

  val categorisation:Map[NatureAffaire,Set[String]] = Map(
    sexuel -> Set("proxénétisme","viol","viols","sexuel","sexuelle","attouchement","attouchements"),
    discrimination -> Set("discrimination","discriminatoire","racial","raciale","haine raciale","racisme","nazisme","nazi","immigré","immigrés","humanité"),
    economique -> Set("vol","abus de confiance","traffic d'influence","favoritisme","blanchiment","bien social","biens sociaux","emploi fictif","emploi fictifs","emplois fictifs","travail dissimulé", "corruption"),
    fiscal -> Set("fraude fiscale","impots","impôts","détournement","fonds publics"),
    violence -> Set("violence","coups","coup","blaissure","blaissures","violent","menace","menaces"),
    diffamation -> Set("image","diffamation")
  )

  def readFromString(infractions:Seq[String]):Set[NatureAffaire] = {
    infractions.foldLeft(Set.empty[NatureAffaire]){(r,s) =>
      categorisation.filter{ case (k,v) => v.exists(x => s.contains(x) && ( !s.sameElements(x) || s.equalsIgnoreCase(x) ))}.toSeq match {
        case m => r ++ m.map(_._1)
        case Nil => r
      }
    }
  }
  override def toString() = super.toString().toLowerCase()
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

  implicit val affaireJsonFormat = Json.format[Affaire]
  implicit val affairesWrite = play.api.libs.json.Writes.traversableWrites[Affaire]
  implicit val affairesRead = play.api.libs.json.Reads.traversableReads[Seq,Affaire]
  val collection = db.collection[JSONCollection]("affaires")
  val alivesQuery = Json.obj("deleted"->Json.obj("$ne"->true))
  def alives(js:JsObject,sort:JsObject = Json.obj()) = find[Affaire](alivesQuery ++ js, sort)
  def byPid(id:BSONObjectID) = find[Affaire](Json.obj("pid"->id)).toList
  def byId(id:BSONObjectID):Future[Option[Affaire]] = find[Affaire](Json.obj("_id"-> Json.toJson(id))).headOption
  def byId(id:String):Future[Option[Affaire]] = byId(BSONObjectID(id))

  def delete(a:Affaire):Future[Boolean] = {
    assert(a._id.nonEmpty)
    val copy: Affaire = a.copy(deleted = Some(true))
    collection.update[JsObject,JsValue](
      Json.obj("_id"-> Json.toJson(a._id.get)),
      Json.toJson(copy
    )).map(log).map(!_.inError)

  }
  def allChecked:Future[List[Affaire]] = alives(Json.obj("checked"->true)).toList // how to get only pid field
  def allUnchecked:Future[List[Affaire]] = alives(Json.obj("checked"->false),Json.obj("_id" -> -1)).toList
}
