const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reviews_lite',{ useNewUrlParser: true })
// mongoose.connect('mongodb://18.218.58.182:27017/sdc_reviews',{ useNewUrlParser: true }).then(
//   ()=>{
//     console.log('connected to database')
//   }
// ).catch((err)=> {
//   console.log(err)
// })
//const connection = mongoose.createConnection('mongodb://localhost/reviews_lite')


//schema        
const reviewsSchema = mongoose.Schema({
  _id: String,
  body: String,
  rating: Number,
  product_id: String,
  characteristics: Object,
  response: String,
  summary: String,
  reported: {type: String, defult: 0},
  helpfulness: String,
  recommend: Number,
  date: { type: Date, default: Date.now },
  email: String,
  name: String,
  photos: Array
})

const charSchema = mongoose.Schema({
  _id: String,
  characteristics: Object
})

//create Index at schema level:
reviewsSchema.index({product_id: -1})

//model
const Review = mongoose.model('Review', reviewsSchema, 'reviews')
const Char = mongoose.model('Char',charSchema,'chars');

//query db by id
const retreive = (id,count,page) => {
  return Review
          .find({"product_id":id})
          .then((data) =>{
            //filter and pagination
            //console.log('data:',data)
            let newData = data
                          .filter(d => d.reported === '0')
                          .slice(page*count,(page+1)*count)
            return newData
          })
          // .exec();
}

const retreiveMetaList = (id) => {
  return Review
          .find({"product_id":id},{"_id":0,"rating":1,"recommend":1,"characteristics":1})
          .exec()
}

const retreiveChar = (id) => {
  return Char
          .findOne({"_id":id},{"_id":0,"characteristics":1})
          .exec()
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
  //console.log(newReview)
  return newReview.save().catch((err)=>{
    console.log(err)
  })
}

const updateHelpfulness = (review_id) => {
  return Review
        .findByIdAndUpdate(review_id, {$inc:{"helpfulness":1}})
        .catch((err) => {
          console.log(err)
        })
}

const updateReport = (review_id) => {
  return Review
        .update({"_id":review_id}, {$set:{"reported":1}})
        .catch((err)=> {
          console.log(err)
        })
}

module.exports.retreive = retreive;
module.exports.save = save;
module.exports.updateHelpfulness = updateHelpfulness;
module.exports.updateReport = updateReport;
module.exports.retreiveMetaList = retreiveMetaList;
module.exports.retreiveChar = retreiveChar;