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
      let r = data.map((d) => {
        //format data
        let photos = []
        console.log(d['photos'])
        if(d['photos'].length !== 0){
          for(let i = 0; i < d['photos'].length; i ++){
            photos.push({'id':i + 1, 'url':d['photos'][i]})
          }
        }
        let response = ''
        if(d['response'] !== "null") {
          response = d['response'];
        }        
        d = {
          review_id: d['_id'],
          rating: d['rating'],
          summary: d['summary'],
          recommend: d['recommend'],
          response: response,
          body: d['body'],
          date: d['date'],
          reviewer_name: d['name'],
          helpfulness: d['helpfulness'],
          photos: photos
        }
        return d
      })
      const response ={
        product: id,
        page: page,
        count: count,
        results: r
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
  let data = req.body;
  
  const id = req.params.product_id;
  db.save(id,data).then(
    ()=>{
      res.sendStatus(201)
    }
    
  ).catch(
    (err) => {
      console.log("error:",err)
      res.sendStatus(418)
    }
  );
  
})

app.put('/reviews/helpful/:review_id',(req,res) => {
  const id = req.params.review_id;
  db.updateHelpfulness(id).then(
    () => {
      res.sendStatus(204);
    }
  ).catch((err) => {
    res.sendStatus(418);
  })
})

app.put('/reviews/report/:review_id',(req,res) => {
  const id = req.params.review_id;
  db.updateReport(id).then(
    () => {
      res.sendStatus(204);
    }
  ).catch((err) => {
    res.sendStatus(418);
  })
})


app.listen(port, () => console.log('Server running...'));
