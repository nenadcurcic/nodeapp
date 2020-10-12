const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
// kazemo aplikaciji da koristi json iz body-a requesta.
app.use(express.json());

var refTokens = [];

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const user = {
        username: username,
        mail: 'nenad@mail.com'
    }

    const accessToken = GenerateAccessToken(user);
    const refreshToken = GenerateRefreshToken(user);
    res.send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: username
    })
});

app.delete('/api/logout', (req, res)=>{
    console.log('removing token: ' + req.body.token);
    refTokens = refTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

app.post('/api/token', (req, res) => {
    let token = req.body.token;
    //console.log('refreshing token: ' + token);
    if (token == null) {
        return res.sendStatus(401);
    }
    if (refTokens.includes(token))
    {
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
            if(err) return res.sendStatus(403);
            let accessToken = GenerateAccessToken({name: user.userName});
            res.json(accessToken);
        });
    } else 
    {
       // console.log('ne sadrzi refresh token ' + refTokens.includes(token));
        return res.sendStatus(403);
    }
})

function GenerateAccessToken(user)
{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
}

function GenerateRefreshToken(user)
{
    let refToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refTokens.push(refToken);
    return refToken;
}


app.listen(process.env.PORT_AUTH_SERVER, () => {
    console.log(`Listening on ${process.env.PORT_AUTH_SERVER}.`);
});