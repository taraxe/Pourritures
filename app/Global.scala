import play.api._

/**
 * User: ala
 * Date: 29/05/13
 * Time: 16:24
 */
import play.api.libs.json._
import models._
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
    val jsonBytes = io.Source.fromFile("public/data/import.json").getLines().mkString
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

    import org.joda.time.DateTime
    json match {

      case JsArray(arr) =>
        val name2Affaires = arr.groupBy(x => (x \ "fullname").as[String])

      name2Affaires.foreach{ case (name,affaires) =>
        val p = affaires.head.as[Pourri](pourriReads)
        Pourri.save(p).map{ _ =>
          affaires.foreach{a =>

            val na = Affaire(
              None,
              p._id,
              new DateTime().withYear((a \ "annee").as[Int]),
              (a \ "nature").as[String] match {
                case s if s.contains("condamnation") => TypeAffaire.condamnation
                case _ => TypeAffaire.examen
              },
              (a \ "ammende").asOpt[Int],
              (a \ "infractions").as[Array[String]],
              None,
              true
            )
            Affaire.save(na)
          }
        }

      }
        Logger.info("Inserted %s pourritures".format(name2Affaires.size))
      case _ => Logger.error("malformed json")
    }
  }
}