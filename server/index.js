const express = require('express')
const parser = require('body-parser')
const app = express();
const db = require('../db/index.js')
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.get(`/reviews/:product_id/list`,(req,res) => {
  console.log(req.params.product_id)
  const id = req.params.product_id;
  db.retreive(id).then(
    (data) => {
      //console.log(data)
      res.status(200).send(data);
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



app.listen(port, () => console.log('Server running...'));
