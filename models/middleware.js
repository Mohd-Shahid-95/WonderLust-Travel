const  Listing=require("./listing.js");
module.exports.isLogged=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("success","You must be log in the wonderlust");
        return res.redirect("/login")
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async (req, res, next) => {
  
    let {id} = req.params; // ID from URL like /posts/:id
    let listing = await Listing.findById(id);

    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error","You don't have permission to edit the post");
      return res.redirect(`/listings/${id}`);
    }
    next();
  };