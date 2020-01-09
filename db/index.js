const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/reviews_lite',{ useNewUrlParser: true })
        .then(() => console.log('connected'))
//schema        
const reviewsSchema = mongoose.Schema({
  _id: String,
  reviews: Array
})
// const characteristicsSchema = mongoose.Schema({
//   _id: String,
//   characteristics: Array
// })
//model
const Review = mongoose.model('Review', reviewsSchema, 'reviews')
//const Characteristics = mongoose.model('Characteristics',characteristicsSchema,'characteristics')

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
              delete d.reviewer_email;
            });
            const response ={
              product: id,
              page: page,
              count: count,
              results: newData
            }
            return response
          })
          // .exec();
}

const save = (review) => {

}

module.exports.retreive = retreive;
module.exports.save = save;