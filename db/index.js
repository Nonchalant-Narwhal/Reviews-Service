const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/reviews_lite',{ useNewUrlParser: true })
        .then(() => console.log('connected'))
//schema        
const reviewsSchema = mongoose.Schema({
  rating: Number,
  summary: String,
  body: String,
  recommend: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  photos: Array,
  characteristics: Array

})
//model
const Review = mongoose.model('Review', reviewsSchema)

//query db by id
const retreive = (id,count,page) => {
  return Review
          .findOne({"_id":id},{"_id":0})
          .then((data) =>{
            //pagination
            let newData = data.reviews.slice(page*count,(page+1)*count)
            newData.forEach((d) =>{
              d["review_id"] = d["id"];
              delete d.id;
              delete d.characteristics;
            });
            
            return newData;
          })
          .catch((err) => {
            //if reviews not found
            return [];
          })
          // .exec();
}

//save review
const save = (prod_id,review) => {
  //format recommend
  if(review.recommend === true) {
    const recommend = '1'
  } else {
    const recommend = '0'
  }
  // let newReview = new Review({
  //   rating: review.rating,
  //   summary: review.summary,
  //   body: review.body,
  //   recommend: recommend,
  //   reviewer_name: review.name,
  //   reviewer_email: review.email,
  //   photos: review.photos,
  //   characteristics: 
  // })
}

module.exports.retreive = retreive;