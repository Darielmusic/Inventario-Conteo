module.exports = async function(req,res,next){
    console.log(req.header("cookie"))
    let cookie = req.header("cookie").split(";")[0]
    console.log(cookie)
    if(cookie == "PUTITO") next()
    else res.sendStatus(401)
   
}