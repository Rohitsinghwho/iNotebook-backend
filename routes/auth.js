const express= require('express');
// bcrypt is an hash generating framework of nodejs to hash passwords
const bcrypt = require('bcrypt');
//jsonwebtoken used to securely communicate with the user and server
var jwt = require('jsonwebtoken');
//required fetchuser file to get the user data
const fetchuser = require('../middleware/fetchuser');
//intializing a router
const router= express.Router();
// destructring and call body and validationREsults from express validator
const { body, validationResult } = require('express-validator');
//required user from models
const User = require('../models/User');
const seckey='rohitisadevlope&r'
// Route :1 Creating a User: required no auth on api/auth/createuser- no login required
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
       response.status(500).send("internal error occured")
   }
})


//  Route :2 Authenticate a user /api/auth/login - no login required
router.post('/login',[
   // authenticating if the email exists and password exists 
   body('email',"Enter a valid Email").isEmail(),
   body('password','password should not be empty').exists()
  ], async (request,response)=>{
   const results= validationResult(request);
   // if there are error 
   if(!results.isEmpty()){
    return response.status(400).json({error:results.array()});
   }
   // destructuring the email and password and taking them out of request.body
   const {email, password}= request.body;
   try {
      // taking the user out of the database and checking furture
      let user= await User.findOne({email});
      // if the email entered by the user is not in database i will show this error
      if(!user){
         return response.status(400).json({error:"please enter the correct credentials"});
      }
      //taking the password out of the db and comparing it with the bcypt generated hash
      let userPassword=  await bcrypt.compare(password, user.password);
      //if the password entered by the user is not in the db then i will show this error
       if(!userPassword){
         return response.status(400).json({error:"please enter the correct credentials"});
       }

       //finally if everything is cool i will send the object of data
      const data={
         user:{
            email:user.id
         }
      }
      //signing the data with a secret key
      const authtoken= jwt.sign(data,seckey);
   
      response.json(authtoken)


   } catch(error){
      console.error(error.message);
      response.status(500).send("internal error occured")
  }
})

// Route :3 Get he user details /api/auth/getuser - login required
router.post('/getuser',fetchuser, async (req,res)=>{

   try {
      const userid=await req.user.email;
      const user= await User.findById(userid).select("-password")
      res.json({user})
   } catch(error){
      console.error(error.message);
      res.status(500).send("internal error occured");
  }
}
)
module.exports=router;