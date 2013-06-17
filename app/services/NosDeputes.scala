package services

/**
 * User: ala
 * Date: 29/05/13
 * Time: 17:33
 */
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.ws._

object NosDeputes {

  private val urls = Seq("http://www.nosdeputes.fr/%s/json","http://www.nossenateurs.fr/%s/json")

  def bySlug(s:String):Future[Option[(String, String)]] = {

    val futures: Seq[Future[Option[(String, String)]]] = for (url <- urls) yield {
      for (r <- WS.url(urls.head.format(s)).get(); if ((r.status >= 200 && r.status < 300))) yield {
        import play.api.libs.json.Json
        val d = Json.parse(r.body) \ "depute"
        Some(((d \ "nom_de_famille").as[String], (d \ "prenom").as[String]))
      }
    }
    Future.sequence(futures)
      .map{ _.find(_.isDefined).flatten}
  }

}