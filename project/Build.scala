import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "un-pour-tous-tous-pourris"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq.empty


  val main = play.Project(appName, appVersion, appDependencies).settings(
    requireJs += "main.js"/*,
    requireJsShim += "main.js"*/
    // Add your own project settings here      
  )

}
