const mongoose=require("mongoose");
const Review=require("./reviews.js");
const Schema = mongoose.Schema;

const listingSchema =new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: ''
    },
    url: {
        type: String,
        default:"https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        set:(v)=>
          v === ""
             ? "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
             : v,
    },
    price: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    },
    reviews: [
      { 
      type: Schema.Types.ObjectId,
      ref: "Review" }
    ],
    owner: [
      { 
      type: Schema.Types.ObjectId,
      ref: "User" }
    ],
  });
  //listing reviews middleware...for when we delete the listing then all the review also will delete..we used post middleware
 listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    console.log("Deleting reviews for:", listing._id);
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
  
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;