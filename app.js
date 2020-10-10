const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/api', (req, res)=>{
    res.json({
        message: 'Welcome to the API'
    });
    console.log('Request received!');
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.statusCode = 201;
            res.json({
                message: 'Post created',
                authData: authData
            });
        }
    });
    console.log('Post request received!');
});

app.post('/api/login', (req, res)=>{
    console.log(req.body);
    const user = {
        id: 1,
        username: 'nenad',
        email: 'nenad@email.com'
    }
    jwt.sign({user: user}, 'secretKey',{expiresIn: '30s'}, (err, token) => {
        res.statusCode = 200;
        res.json({
            token: token,
            user: user.username
        });
    });  
})

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

     if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ')[1];
        req.token = bearer;
        next();
     } else {
          res.sendStatus(403);
     }
}

app.listen(5000, ()=>{
    console.log('Server started on port 5000.');
});