import play.api._

/**
 * User: ala
 * Date: 29/05/13
 * Time: 16:24
 */
import play.api.libs.json._
import services.NosDeputes
import models.Pourri
import scala.concurrent.ExecutionContext.Implicits.global



object Global extends GlobalSettings {

  import models._

  override def onStart(app: Application) {
    import scala.concurrent.duration._
    import scala.concurrent.Await


    Logger.info("Application has started")

    if(Await.result(Pourri.count(),3 seconds) < 1) {
      Logger.info("Bulk insert of the pourritures")
      importData()
    }
  }

  override def onStop(app: Application) {
    Logger.info("Application shutdown...")
  }

  def importData():Unit = {
    val jsonBytes = io.Source.fromFile("public/data/newPourritures.json").getLines().mkString
    val json = Json.parse(jsonBytes)

    val pourriReads = new Reads[Pourri] {
      import reactivemongo.bson.BSONObjectID
      def reads(json: JsValue) = JsSuccess(Pourri(
        Some(BSONObjectID.generate),
        (json \ "nom").as[String],
        (json \ "prenom").as[String],
        (json \ "formation").as[String] match {
          case "ump" => Formation.UMP
          case "ps" => Formation.PS
          case "fn" => Formation.FN
          case "udi" => Formation.UDI
        },
        (json \ "ex").asOpt[Boolean],
        (json \ "gouvernement").asOpt[Boolean]
      ))
    }

    json match {
      case JsArray(arr) =>
        val name2Affaires = arr.groupBy(x => (x \ "name").as[String])

      name2Affaires.foreach{ case (name,affaires) =>
        Logger.debug(name)
        val p = affaires.head.as[Pourri](pourriReads)
        Pourri.save(p).map{ _ =>
          affaires.foreach{a =>
            import _root_.models.Affaire
            import org.joda.time.DateTime
            val newAffaire = Affaire(
              None,
              p._id,
              new DateTime().withYear((a \ "annee").as[Int]),
              (a \ "nature").as[String] match {
                case s if s.contains("condamnation") => TypeAffaire.condamnation
                case _ => TypeAffaire.examen
              },
              (a \ "ammende").asOpt[Int],
              (a \ "raison").as[Array[String]],
              None,
              true
            )
            Affaire.save(newAffaire)
          }
        }

      }
      case _ => Logger.error("malformed json")
    }
  }


/*  def loadFromRegardsCitoyens()={
    val jsonBytes = io.Source.fromFile("public/data/pourritures.json").getLines().mkString
    val json = Json.parse(jsonBytes)

    json match {
      case JsArray(v) => {
        v.groupBy(e => ( e \ "name").as[String]).map{ case (k,d) =>
          val slug = Pourri.slugFromString((d.head \ "name").as[String])
          NosDeputes.bySlug(slug).collect{
            case Some((n,p)) => {
              //Logger.debug(n +" "+ p)
            }
            case None => Logger.error(slug+" not found on nos deputés")
          }.recover{
            case t:org.codehaus.jackson.JsonParseException => Logger.error(s"$slug failed")
          }
        }
      }
      case _ => Logger.error("Malformed json")
    }
  }*/

  import java.io.File
  class RichFile( file: File ) {

    import scala.io.{Source, Codec}

    def text = Source.fromFile( file )(Codec.UTF8).mkString

    def text_=( s: String ) {
      import java.io.PrintWriter
      val out = new PrintWriter( file , "UTF-8")
      try{ out.print( s ) }
      finally{ out.close }
    }
  }
  object RichFile {
    implicit def enrichFile( file: File ):RichFile = new RichFile( file )

  }

}