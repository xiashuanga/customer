import CryptoJS from 'crypto-js'

var keyNum = 'hxgj0571'
var ivNum = '05710571'
// ===================================jiami
export function getAES (plaintext) {
  // 加密
  var key = CryptoJS.enc.Utf8.parse(keyNum)
  var iv = CryptoJS.enc.Utf8.parse(ivNum)
  var encrypted = CryptoJS.DES.encrypt(plaintext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
  // return base64
}
// =============================== jiemi
export function getDAes (encrypted) {
  var key = CryptoJS.enc.Utf8.parse(keyNum)
  var iv = CryptoJS.enc.Utf8.parse(ivNum)
  var decrypted = CryptoJS.DES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// 加密
// console.log(encodeURIComponent(getAES(JSON.stringify({}))))

// 解密
// console.log(JSON.stringify(getDAes()))
