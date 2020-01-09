const mongoose = require('mongoose');
const moment = require('moment');
mongoose.connect('mongodb://localhost/reviews_lite',{ useNewUrlParser: true })
        .then(() => console.log('connected'))
//schema        
const reviewsSchema = mongoose.Schema({
  _id: String,
  reviews: Array
})

//model
const Review = mongoose.model('Review', reviewsSchema, 'reviews')

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