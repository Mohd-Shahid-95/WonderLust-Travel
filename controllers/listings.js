const Listing=require("../models/listing");
// index route..
module.exports.indexroute=async(req,res)=>{
    const all_listing=await Listing.find({});
    res.render("./listings/index.ejs",{all_listing});
 };
//  create route..
 module.exports.addroute=async(req,res)=>{
       const newlist=new Listing(req.body.listing);
       newlist.owner=req.user._id;
       await newlist.save()
       req.flash("success","New listing created!");
       res.redirect("/listings")
 };
 // edit route...
 module.exports.editroute=async(req,res)=>{
     const{id}=req.params;
     const listing=await Listing.findById(id);
     res.render("./listings/edit.ejs",{listing});
  };
  //put route...
 module.exports.putroute= async(req,res)=>{
      const{id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success","Listing edited!");
      res.redirect("/listings");
   };
//    delete route..
 module.exports.deleteroute=async(req,res)=>{
    const{id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
 }
//  show route..
 module.exports.showroute=async(req,res)=>{
    const{id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","listing you requested for does not exit");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
 }
 //search route
 module.exports.searchroute=async (req, res) => {
  const query = req.query.q || "";
    const all_listing= await Listing.find({
      title: { $regex: query, $options: "i" }
    });

    if (all_listing.length === 0) {
      req.flash("error", "No title found matching your search.");
      return res.redirect("/listings");
    }

    res.render("./listings/index", { all_listing });
  
};
