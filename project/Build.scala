import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "un-pour-tous-tous-pourris"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    "org.reactivemongo" %% "play2-reactivemongo" % "0.9" withSources,
    "net.tanesha.recaptcha4j" % "recaptcha4j" % "0.0.7" withSources
  )

  // Only compile the bootstrap bootstrap.less file and any other *.less file in the stylesheets directory
  def customLessEntryPoints(base: File): PathFinder = ( (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++ (base / "app" / "assets" / "stylesheets" * "*.less") )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    lessEntryPoints <<= baseDirectory(customLessEntryPoints)
  )

}
