const express = require('express')
const app = express()
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Simple jwt auth based on key 'secreate' and token in query string
app.get('/', (req, res) => {
    res.statusCode = 401;
    if(req.headers['x-original-uri'] && req.headers['x-original-uri'].split('?token=').length === 2){
        let token = req.headers['x-original-uri'].split('?token=')[1];
        jwt.verify(token, 'secreate' ,function(err, decoded) {      
            if (err) {
                console.log(err)
              return res.send('hi')    
            } else {
                res.statusCode = 200;
                return res.send('hi')
            }
          });
        
    }else{
        res.send('hi')
    }
})

const port = process.env.APP_PORT || 3001

app.listen(port, () => console.log(`Example app auth-jwt listening on port ${port}!`))