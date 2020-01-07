const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/reviews_lite',{ useNewUrlParser: true })
        .then(() => console.log('connected'))
        
// mongoose.connection.on("open", err => {
//   if (err) console.log(chalk.red("Error connecting to our mongo database"));
//   console.log("Connected to mongo database successfully");
// });
const reviewsSchema = mongoose.Schema({
  _id: String,
  reviews: Array
})
const Review = mongoose.model('Review', reviewsSchema)

const retreive = (id) => {
  return Review.find({"_id":id}).exec();
}

module.exports.retreive = retreive;