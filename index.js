require('dotenv').config();
const express=require('express');
const app=express();
const path=require("path");
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const  Listing=require("./models/listing.js");
const ejsMate = require('ejs-mate');
const WrapAsync=require("./err detect/asywrap.js");
const express_Err=require("./err detect/expresserr.js");
const{listingSchema,reviewSchema}=require("./Schema.js");
const Review=require("./models/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport = require('passport');
const LocalStrategy= require('passport-local');
const User = require('./models/pass.js');
const user = require('./router/user.js');
const {isLogged} = require('./models/middleware.js');
const {saveRedirectUrl} = require('./models/middleware.js');
const {isOwner} = require('./models/middleware.js');
const ListingController = require('./controllers/listings.js');
const ReviewController = require('./controllers/reviews.js');
const UserController = require('./controllers/users.js');
const urlDB=process.env.ALTAS_DB;

mongoose.connect(urlDB)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const store = MongoStore.create({
      mongoUrl:urlDB,
      crypto: {
         secret:process.env.SECRET,
      },
      touchAfter:24*3600,
})

//express Session
const sessionOption={
   store,
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie:{
      expires:Date.now() + 7 * 24 * 60 * 60 *1000,//expiring date of cookie 
      maxAge:7 * 24 * 60 * 60 * 1000,
      httpOnly:true,
   }
}
app.use(session(sessionOption));
app.use(flash());
//Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//flash msg...
app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currentUser=req.user;
   next();
});
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

 //validation listing..
 const validateListing=(req,res,next)=>{
   let{error}=listingSchema.validate(req.body);
   if(error){
      let errMsg=error.details.map((el)=> el.message).join(",");
      throw new Error(400,errMsg)
   }else{next();

   }
};
//validation review..
const validateReview=(req,res,next)=>{
   let{error}=reviewSchema.validate(req.body);
   if(error){
      let errMsg=error.details.map((el)=> el.message).join(",");
      throw new Error(400,errMsg)
   }else{next();

   }
};
//  index route....
 app.get("/listings",WrapAsync(ListingController.indexroute));
 //Create route...
 app.get("/listings/new",isLogged,(req,res)=>{
    res.render("./listings/create.ejs");});
//add route..
app.post("/listings",validateListing,
   WrapAsync(ListingController.addroute));
//edit route..
app.get("/listings/:id/edit",isLogged,WrapAsync(ListingController.editroute)
);
 app.put("/listings/:id",isLogged,validateListing,WrapAsync,(ListingController.putroute)
);
 //delete the listing...
 app.delete("/listings/:id",isLogged,WrapAsync(ListingController.deleteroute)
);

 //Show route...
 app.get("/listings/:id",WrapAsync(ListingController.showroute)
);
//reviews
//post
app.post("/listings/:id/reviews",validateReview,
   
   WrapAsync(ReviewController.createReview)
);
app.delete('/listings/:id/reviews/:reviewId',
   WrapAsync(ReviewController.deleteReview));
//password...
// app.get("/userDemo",async(req,res)=>{
//    let fakeUser=new User({
//       email:"khannshahid95@gmail.com",
//       username:"hellooo"
//    });
//    let fakedemo=await User.register(fakeUser,"hellodemooo");
//    res.send(fakedemo);
// });
//signup
app.get("/signup",(req,res)=>{
   res.render("./user/signup.ejs");
});
app.post("/signup",WrapAsync( UserController.signUp)
);
//login...
app.get("/login",(req,res)=>{
   res.render("./user/login.ejs");
});
app.post('/login', 
   saveRedirectUrl,
   passport.authenticate('local', { failureRedirect: '/login',
      failureFlash:true
    }),(UserController.Login)
   );
//logout
app.get("/logout",(UserController.logOut));

// ✅ Search Route
app.get("/search",WrapAsync(ListingController.searchroute));

// app.get("/testlisting",(req,res)=>{
//    const sample_Listing=new Listing({
//     title:"My new Value",
//     description:"By the beach",
//     price:1200,
//     location:"GOA",
//     country:"INDIA"
//    });
// sample_Listing.save();
// res.send("working...");

// });
// app.all("*" , (req,res,next)=>{
//    next(new express_Err(446,"Page not Found!"));
//});
app.use((error,req,res,next)=>{
   let{statuscode=400,message="Something wrong"}=error;
   res.status(statuscode).render("./listings/errboot.ejs",{message});
}
);

// app.get("/",(req,res)=>{
//     res.send("It is working");
// });
app.listen(3000,()=>{console.log("port is connected 3000");})
