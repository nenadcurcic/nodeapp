const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const posts = [
    {
        username: 'Nenad',
        title: 'Post 1'
    },
    {
        username: 'Natasa',
        title: 'Post 2'
    }
]

const app = express();
// kazemo aplikaciji da koristi json iz body-a requesta.
app.use(express.json());


app.get('/api/post', verifyToken, (req, res) => {
    try {
        console.log('verified user: ' + req.user.username);        
        res.json(posts.filter(post => post.username === req.user.username));
    } catch (error) {
        console.log('Didnt managed to read token');
    }

    //res.send(posts);
});

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

     if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')[1];        
        jwt.verify(bearer, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if (err) res.sendStatus(403);
            req.user = user;
            //console.log('from token: ' + bearer);
            next();
        });
     } else {
          res.sendStatus(401);
     }
}

app.listen(process.env.PORT_API_SERVER, ()=>{
    console.log(`Listening on ${process.env.PORT_API_SERVER}`);
});