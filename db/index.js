const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment');
mongoose.connect('mongodb://localhost/reviews_lite',{ useNewUrlParser: true })

//const connection = mongoose.createConnection('mongodb://localhost/reviews_lite')

//autoIncrement.initialize(connection);
//schema        
const reviewsSchema = mongoose.Schema({
  _id: String,
  body: String,
  rating: Number,
  product_id: String,
  characteristics: Object,
  response: String,
  summary: String,
  reported: String,
  helpfulness: Number,
  recommend: Number,
  date: { type: Date, default: Date.now },
  email: String,
  name: String,
  photos: Array
})
//create Index at schema level:
reviewsSchema.index({product_id: -1})
//plugin auto increment for id:
// reviewsSchema.plugin(autoIncrement.plugin,{
//   model: 'Review',
//   field: '_id',
//   startAt: "5777923"
// })

//model
const Review = mongoose.model('Review', reviewsSchema, 'reviews')

//query db by id
const retreive = (id,count,page) => {
  return Review
          .find({"product_id":id})
          .then((data) =>{
            //filter and pagination
            let newData = data
                          .filter(d => d.reported === '0')
                          .slice(page*count,(page+1)*count)
            return newData
          })
          // .exec();
}

const save = (prod_id,data) => {
  let recommend = '0'
  if(data.recommend === 'true'){
    recommend = '1'
  }
  let newReview = new Review({
    body: data.body,
    rating: data.rating,
    product_id: prod_id,
    characteristics: data.characteristics,
    response: "",
    summary: data.summary,
    reported: "0",
    helpfulness: "0",
    recommend: recommend,
    email: data.email,
    name: data.name,
    photos: data.photos
  });
  newReview.save().catch((err)=>{
    console.log(err)
  }).exec()
}

const updateHelpfulness = (review_id) => {
  return Review.update({"_id":review_id}, {$inc:{"helpfulness":1}})
}

const updateReport = (review_id) => {
  return Review.update({"_id":review_id}, {$set:{"reported":1}})
}

module.exports.retreive = retreive;
module.exports.save = save;
module.exports.updateHelpfulness = updateHelpfulness;
module.exports.updateReport = updateReport;