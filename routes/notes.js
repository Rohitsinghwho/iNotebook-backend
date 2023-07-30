const express= require('express');
const router= express.Router();

router.get('/', (req,res)=>{

    obj={
        name :"Srishti",
        Gender:"female",
        Age:10
    }
    res.json(obj);
})

module.exports=router;