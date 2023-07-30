const express= require('express');
// bcrypt is an hash generating framework of nodejs to hash passwords
const bcrypt = require('bcrypt');
//jsonwebtoken used to securely communicate with the user and server
var jwt = require('jsonwebtoken');

const router= express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const seckey='rohitisadevlope&r'
// Creating a User: required no auth on api/auth/createuser- no login
router.post('/createuser',[
 body('name',"Enter a valid Name").isLength({min:3}),
 body('email',"Enter a valid Email").isEmail(),
 body('password').isLength({min:5})
], async (request,response)=>{
   const results= validationResult(request);
   // if there are error 
   if(!results.isEmpty()){
    return response.status(400).json({error:results.array()});
   }
   try{
   // checking if the user with the email already exists?
   let user= await User.findOne({email:request.body.email});
   if(user){
      return response.status(400).json({error:"user Already exist"});
   }
   // salt is some additional details with the password added by bcrypt to make it secure and gensalt return a promise
   let salt= await bcrypt.genSalt(10)
   //hash function will hash the password with salt and bcrypt will internally generate a hash value of the password after adding salt
   //it also returns a promise
   let securedpass= await bcrypt.hash(request.body.password,salt);
   // if user not present then create one
    user = await User.create({
    name:request.body.name,
    password:securedpass,
    email:request.body.email,
   })
   //defining data for jsonwebtoken
   const data={
      user:{
         email:user.id
      }
   }
   //signing the data with a secret key
   const authtoken= jwt.sign(data,seckey);

   response.json({authtoken})
   // .then(user => response.json(user))
   // .catch(err=>console.log(err))
   }catch(error){
       console.error(error.message);
   }
})
module.exports=router;