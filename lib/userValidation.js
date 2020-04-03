/**
 * user credentials validation utility
 *
 * @author Niall Thurrat
 * @version 1.0.0
 *
 * @credits got a lot of help from jonnie.io for this module. Tutorial found at:
 * http://jonnie.io/blog/node/rest/express/2014/07/19/Node-Restful-Api-part-2.html
 *
 */

'use strict'

module.exports = {
  isAlphaNumericOnly: function (input) {
    var letterNumberRegex = /^[0-9a-zA-Z]+$/
    if (input.match(letterNumberRegex)) {
      return true
    }
    return false
  },
  isLongEnoughPassword: function (input) {
    if (input.length >= 8) {
      return true
    }
    return false
  },
  isCorrectLengthUsername: function (input) {
    if (input.length >= 6 && input.length <= 12) {
      return true
    }
    return false
  },
  isGoodPassword: function (input) {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
    return regex.test(input)
  },
  isSafe: function (input) {
    var regex = /([$])/
    return !regex.test(input)
  }
}
