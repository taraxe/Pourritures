package views


import java.util.Properties
import net.tanesha.recaptcha.ReCaptchaFactory
import play.api.Play.current


object ReCaptcha {

  def publicKey(): String = {
    current.configuration.getString("recaptcha.publickey").getOrElse(throw new IllegalStateException("Could not find recaptcha public key"))
  }
  def privateKey(): String = {
    current.configuration.getString("recaptcha.privatekey").getOrElse(throw new IllegalStateException("Could not find recaptcha private key"))
  }
  def render(): String = {
    ReCaptchaFactory.newReCaptcha(publicKey(), privateKey(), false).createRecaptchaHtml(null, new Properties)
  }
  def check(addr: String, challenge: String, response: String): Boolean = {
    import net.tanesha.recaptcha.ReCaptchaImpl
    val reCaptcha = new ReCaptchaImpl()
    reCaptcha.setPrivateKey(privateKey())
    val reCaptchaResponse = reCaptcha.checkAnswer(addr, challenge, response)
    reCaptchaResponse.isValid()
  }
}