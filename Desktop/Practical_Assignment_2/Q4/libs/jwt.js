const jwt=require("jsonwebtoken")
const secret="str1";

function create_token(req,res)
{
    // db query, check username, password, if username password valid- return token - else login
    const token=jwt.sign({username:"user1",role:"admin"},secret,{algorithm:"HS256",expiresIn:1200})
    res.send(token);
}

function verify_token(req, res, next)
{
    var token=req.headers.authorization;
    if(!token)
    return res.status(401).send("unauthorized . provide token")

    token=token.split(" ")[1]

    try
    {
        var apyload=jwt.verify(token,secret)
        next();
    }
    catch(e)
    {
        return res.status(401).send("unauthorized . provide token")
    }
    
    // console.log(token)
    // res.send(token)
}

module.exports={create_token,verify_token}