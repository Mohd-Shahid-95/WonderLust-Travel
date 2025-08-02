const Listing=require("../models/listing");
const Review=require("../models/reviews");

module.exports.createReview=async(req,res)=>{
     if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to write a review.");
        return res.redirect("/listings");}
      let listing=await Listing.findById(req.params.id);
      let newReview=new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      res.redirect(`/listings/${listing._id}`);
   };

module.exports.deleteReview=async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to delete a review.");
        return res.redirect("/listings");}
    const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id,{
            $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
      };

