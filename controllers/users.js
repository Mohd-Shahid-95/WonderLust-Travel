const  Listing=require("../models/listing");
const User = require('../models/pass');
//signup
module.exports.signUp=async (req,res)=>{
   try{ 
      let {username,email,password}=req.body;
      const newUser= new User({email,username});
      const registeredUser=await User.register(newUser,password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
         if(err){
            return next(err);
         }
         req.flash("success","Welcome Wonderlust")
         res.redirect("/listings");
      })}
      catch(e){
         res.redirect("/signup");
      }
  }

//login
module.exports.Login=async (req, res) =>{
       req.flash("success",'Welcome back to Woderlust!');
      let redirectUrl=res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
     
    }
//logout
module.exports.logOut=async(req,res,next)=>{
   req.logout((err)=>{
      if(err){
         return next(err);
}
   req.flash("success","You are logged Out!");
   res.redirect("/listings");
})
}