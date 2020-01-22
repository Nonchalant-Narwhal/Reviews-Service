const express = require('express')
const parser = require('body-parser')
const app = express();
const db = require('../db/index.js')
const port = 3000

app.use(parser.json())
app.get('/', (req, res) => res.send('Hello World!'))

// list reviews:
app.get(`/reviews/:product_id/list`,(req,res) => {
  const id = req.params.product_id;
  const count = req.query.count||5;
  const page = req.query.page||0;
  db.retreive(id,count,page).then(
    (data) => {
      let r = data.map((d) => {
        //format data
        let photos = []
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
          helpfulness: parseInt(d['helpfulness']),
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

//list meta:
app.get('/reviews/:product_id/meta',(req,res) => {
  const id = req.params.product_id;
  let results = {
    "product_id":id,
    "ratings": {},
    "recommend":{},
    "characteristics":{}
  };
  let map = {};
  const promise1 = db.retreiveChar(id).then(
    (data) => {
      for(key in data.characteristics) {
        map[data.characteristics[key]] = key
      }
      return map;
    }
  )

  const promise2 = db.retreiveMetaList(id).then(
    (data) => {
      for(d of data) {
        if(results.ratings[d.rating] !== undefined) {
          results.ratings[d.rating] += 1;
        } else {
          results.ratings[d.rating] = 1;
        }
        if(results.recommend[d.recommend] !== undefined) {
          results.recommend[d.recommend] += 1;
        } else {
          results.recommend[d.recommend] = 1;
        }
        for(c in d.characteristics) {
          if(results.characteristics[c] !== undefined) {
            results.characteristics[c].push(d.characteristics[c]);
          } else {
            results.characteristics[c] = [];
            results.characteristics[c].push(d.characteristics[c]);
          }
        }                   
      }
      for(key in results.characteristics) {
        const len = results.characteristics[key].length
        let total = results.characteristics[key]
                    .reduce((acc,n) => {
                      return acc + parseInt(n);
                    },0);
        let average = total/len;
        results.characteristics[key] = average.toFixed(4);
      }
      return results;
    }
    
  )
  Promise.all([promise1,promise2]).then(
    (values) => {
      let char = values[0];
      let results = values[1];
      for (key in char) {
        const id = parseInt(char[key]);
        char[key] = {"id":id, "value":results.characteristics[id]}
      }
      results.characteristics = char;
      return results;
    }
  ).then(
    (results) =>{
      res.status(200).send(results);
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
      res.sendStatus(500)
    }
  );
  
})

app.put('/reviews/helpful/:review_id',(req,res) => {
  const id = req.params.review_id;
  console.log('id:',id)
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


//app.listen(port, () => console.log('Server running...'));
app.listen(process.env.PORT || 3000);
