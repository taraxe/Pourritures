package utils

import org.specs2.mutable.Specification
import play.api.test._
import play.api.test.Helpers._
import java.io.File
import scala.io.Source

/**
 * User: ala
 * Date: 05/04/13
 * Time: 16:45
 */
class PourrituresParserTest extends Specification {
  import PourrituresParser._
  "Parser" should {

    val sample = "Anne Hidalgo condamnée en 2012 à 40000 € d'amende pour infraction à la législation sur la durée du travail."


    /*"parse a name" in {
      handleParseResult(PourrituresParser.parse(PourrituresParser.name, sample))
    }

    "parse a nature" in {
      handleParseResult(PourrituresParser.parse(PourrituresParser.name ~> PourrituresParser.nature, sample))
    }
    "parse a date" in {
      handleParseResult(PourrituresParser.parse((PourrituresParser.name ~ PourrituresParser.nature) ~> PourrituresParser.date, sample))
    }
    "parse an amende" in {
      handleParseResult(PourrituresParser.parse((PourrituresParser.name ~ PourrituresParser.nature ~ PourrituresParser.date) ~> PourrituresParser.amende, sample))
    }
    "parse a raison" in {
      handleParseResult(PourrituresParser.parse((PourrituresParser.name ~ PourrituresParser.nature ~ PourrituresParser.date ~ PourrituresParser.amende) ~> PourrituresParser.raison, sample))

    }
    "parse a pourri" in {
      handleParseResult(PourrituresParser.parse(PourrituresParser.pourri, sample))
    }*/
    "parse all socialists pourritures" in {
      val pls = Source.fromFile(new File("data/ps.txt"), "UTF-8").getLines()
      val ps = pls.map(PourrituresParser.parse)

      val r = ps.collect {
        case Right(x) => x
      }

      r.size mustEqual(43)
    }

    def handleParseResult[T](r:ParseResult[T]) = { r match {
        case Success(tree,_) => {
          println("Tree: "+tree)
          success
        }
        case e:NoSuccess => {
          println(e)
          failure(e.toString)
        }
      }
    }
  }
}
