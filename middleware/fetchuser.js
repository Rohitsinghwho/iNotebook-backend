var jwt = require('jsonwebtoken');
const seckey='rohitisadevlope&r';

const fetchuser=(req,res,next)=>{
 const token= req.header('auth-token');
 if(!token){
    res.status(401).send({error:"please enter the correct auth token"})
 }

 try {
    const data= jwt.verify(token, seckey );
    req.user=data.user;
    next();
 } catch (error) {
    res.status(401).send({error:"please enter the correct auth token"})
    
 }
}

module.exports=fetchuser;
