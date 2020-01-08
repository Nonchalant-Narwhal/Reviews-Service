const express = require('express')
const parser = require('body-parser')
const app = express();
const db = require('../db/index.js')
const port = 3000

app.use(parser.json())
app.get('/', (req, res) => res.send('Hello World!'))

// list reviews:
app.get(`/reviews/:product_id/list`,(req,res) => {
  //console.log(req.params.product_id)
  const id = req.params.product_id;
  const count = req.query.count||5;
  const page = req.query.page||0;
  db.retreive(id,count,page).then(
    (data) => {
      //console.log(data)
      const response ={
        product: id,
        page: page,
        count: count,
        results: data
      }
      res.status(200).send(response);
    }
  ).catch(
    (err) => {
      (err) => {
        console.log(err);
        res.sendStatus(404);
      }
    }
  )
})

// add a review:
app.post('/reviews/:product_id',(req,res) => {
  db.save(req.body);
  res.sendStatus(201)
})


app.listen(port, () => console.log('Server running...'));
