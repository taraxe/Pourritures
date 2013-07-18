package services

/**
 * User: ala
 * Date: 29/05/13
 * Time: 17:33
 */
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.ws._
import play.api.libs.json._
import play.api.templates.Html
import java.net.ConnectException

object NosDeputes {
  implicit val timeout = 2000

  private val base = Seq("http://www.nosdeputes.fr","http://www.nossenateurs.fr")
  private val json = base.map(_+"/%s/json?textplain=true")
  private val widget = base.map(_+"/widget/%s?nographe=1&notitre=1&notags=1&noactivite=1&width=400")
  private val pic = base.zip(Set("/depute","/senateur")).map(x => x._1 + x._2+"/photo/%s/%s")

  def bySlug(slug:String):Future[Option[JsValue]] = {
    try {
      val futures = for (url <- json) yield {
        for (r <- WS.url(url.format(slug)).withTimeout(timeout).get()) yield {
          (r.status,r.header("Status")) match {
            case (stc,st) if (stc >= 200 && stc < 300 && st.filter(_.contains("404")).isEmpty) => {
              val b = Json.parse(r.body)
              (b \ "depute") match {
                case JsUndefined(_) => Some(b \ "senateur")
                case x => Some(x)
              }
            }
            case _ => None
        }
      }}
      Future.sequence(futures).map{ _.find(_.isDefined).flatten}
    } catch {
      case e:ConnectException => Future(None)
    }
  }

  def widget(slug:String):Future[Option[Html]] = {
    try {
      val futures = for (url <- widget) yield {
        for (r <- WS.url(url.format(slug)).withTimeout(timeout).get()) yield {
          (r.status,r.header("Status")) match {
            case (stc,st) if (stc >= 200 && stc < 300 && st.filter(_.contains("404")).isEmpty) => Some(Html(r.body))
            case _ => None
          }
        }}
      Future.sequence(futures).map{ _.find(_.isDefined).flatten}
    } catch {
      case e:ConnectException => Future(None)
    }
  }
  def pic(slug:String, width:Int = 100):Future[Option[String]] = {
    try {
      val futures = for (url <- pic) yield {
        val targetUrl = url.format(slug,width)
        for (r <- WS.url(targetUrl).withTimeout(timeout).get()) yield {
          (r.status,r.header("Status")) match {
            case (stc,st) if (stc >= 200 && stc < 300 && st.filter(_.contains("404")).isEmpty) => Some(targetUrl)
            case _ => None
          }
        }}
        Future.sequence(futures).map{ _.find(_.isDefined).flatten}
    } catch {
      case e:ConnectException => Future(None)
    }
  }
}