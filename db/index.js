const mongoose = require('mongoose');
const moment = require('moment');
mongoose.connect('mongodb://localhost/reviews_lite',{ useNewUrlParser: true })
        .then(() => console.log('connected'))
//schema        
const reviewsSchema = mongoose.Schema({
  _id: Number,
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
  data["reviewer_name"] = data["name"];
  delete data["name"];
  data["reviewer_email"] = data["email"];
  delete data["email"];
  data["reported"] = "0";
  data["helpfulness"] = "0";
  data["product_id"] = prod_id;
  data["date"] = moment().format().slice(0,10);
  if(data["recommend"] === true) {
    data["recommend"] = "1";
  } else {
    data["recommend"] = "0";
  }
  console.log(data)
  return Review
          .findByIdAndUpdate(
            prod_id,
            {$push: {reviews: data}}
          )
          .catch(
            (err) => {
              console.log(err)
            }
          )
}

module.exports.retreive = retreive;
module.exports.save = save;