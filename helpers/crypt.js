const crypto = require("crypto")
const CODEC = "SHA256"

function encrypt(data){
    return crypto.createHmac(CODEC,String(data)).digest("hex")
}


module.exports = encrypt