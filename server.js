const express = require('express');

const path = require('path');
const app = express();
const fetch = require('node-fetch');
const favicon = require('express-favicon');

app.use(favicon(__dirname + '/public/favicon.png'));

app.use(express.static(__dirname +'/build'));
//fetch info when you type a username or fetch chartdata
app.get(`/api/:username`, (req, res) => {

    console.log('req.params + ' +req.params.username)

    fetch('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +req.params.username+ '?api_key=RGAPI-50d7d72e-ed68-428b-a6d3-44545c6c3a44')
    .then(res => res.json())
    .then(result => res.json(result));
});

//fetches the usernames accountid to get further information
app.get(`/api/getHero/:accountId`, (req, res) => {

    console.log(`req.params + ` + req.params.accountId)

    fetch('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/' +req.params.accountId+ '?endIndex=20&api_key=RGAPI-50d7d72e-ed68-428b-a6d3-44545c6c3a44')
    .then(res => res.json())
    .then(result => res.json(result));
});

//fetch summoner rank
app.get(`/api/summonerRank/:id`, (req, res) => {

    console.log(`req.params + ` + req.params.id)

    fetch('https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+req.params.id+'?api_key=RGAPI-50d7d72e-ed68-428b-a6d3-44545c6c3a44')
    .then(res => res.json())
    .then(result => res.json(result));
});

app.get("/" , (req ,res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'))
})

app.get("*" , (req ,res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'))
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Started listening with CORS on port ${PORT}`);
  });
