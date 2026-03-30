const express = require('express');
require('dotenv').config();

const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const fetch = require('node-fetch');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


app.use(express.static(__dirname +'/build'));

// console.log('API Key loaded:', process.env.RIOT_API_KEY ? 'YES' : 'NO');
// console.log('API Key:', process.env.RIOT_API_KEY);

//fetch info when you type a username or fetch chartdata
app.get(`/api/:username`, (req, res) => {
    let username = req.params.username;
    
    console.log('username: ' + username)
    // console.log('Calling Riot API v1 Account endpoint...')
    
    // Split gameName and tagLine
    let gameName, tagLine;
    
    if (username.includes('#')) {
        // User provided tagLine
        [gameName, tagLine] = username.split('#');
    } else {
        // Default to NA1 if no tagLine provided
        gameName = username;
        tagLine = 'NA1';
    }
    
    // console.log(`Looking up: ${gameName}#${tagLine}`)
    
    // Step 1: Get account info via Account API
    fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }
    })
    .then(response => {
        if (!response.ok) {
            // console.log('Account API Status:', response.status);
            throw new Error(`Account API Error: ${response.status}`);
        }
        return response.json();
    })
    .then(accountData => {
        // console.log('Account Data:', accountData);
        const puuid = accountData.puuid;
        
        // Try to get summoner level from league API
        const regionMap = {
            'NA1': 'na1',
            'EUW1': 'euw1',
            'KR': 'kr',
            'BR1': 'br1'
        };
        const region = regionMap[tagLine] || 'na1';
        
        // Attempt to fetch summoner data for level info
        fetch(`https://${region}.api.riotgames.com/lol/summoner/v1/summoners/by-puuid/${puuid}`, {
            headers: {
                'X-Riot-Token': process.env.RIOT_API_KEY
            }
        })
        .then(response => {
            if (!response.ok) {
                // console.log(`Summoner API Status: ${response.status}`);
                return response.text().then(text => {
                    // console.log('Summoner API Error Response:', text);
                    return null;
                });
            }
            return response.json();
        })
        .then(summonerData => {
            // Fetch total mastery score
            return fetch(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/scores/by-puuid/${puuid}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            })
            .then(res => {
                if (!res.ok) {
                    console.log('Mastery score API error:', res.status);
                    return 0;  // Default to 0 if fails
                }
                return res.json();
            })
            .then(totalScore => {
                console.log('Total Mastery Score fetched:', totalScore);
                const result = {
                    id: puuid,
                    puuid: puuid,
                    name: gameName,
                    accountId: puuid,
                    profileIconId: summonerData?.profileIconId || 0,
                    totalMasteryScore: totalScore || 0
                };
                
                console.log('Return Account Result:', result);
                res.json(result);
            });
        })
        .catch(err => {
            console.log('Error fetching summoner data:', err.message);
            // Return what we have
            res.json({
                id: puuid,
                puuid: puuid,
                name: gameName,
                accountId: puuid,
                profileIconId: 0,
                totalMasteryScore: 0
            });
        });
    })
    .catch(error => {
        console.log('Error:', error.message);
        res.status(500).json({ error: error.message });
    });
});

//fetches the usernames match history to get champion data
app.get(`/api/getHero/:puuid`, (req, res) => {

    console.log('puuid: ' + req.params.puuid)

    // Step 1: Get match IDs for this player
    fetch(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${req.params.puuid}/top?count=20`, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }

    })
    .then(response => {
        if (!response.ok) {
            // console.log('Match IDs API Status:', response.status);
            throw new Error(`Match IDs API Error: ${response.status}`);
        }
        return response.json();
    })
    .then(masteryData => {
        console.log('Champion mastery data:', masteryData);
        res.json({ champions: masteryData });
    })
    .catch(error => {
        console.log('Error:', error.message);
        res.status(500).json({ error: error.message });
    });
});

//fetch summoner rank
app.get(`/api/summonerRank/:puuid`, (req, res) => {

    console.log('📊 Fetching rank for puuid: ' + req.params.puuid)

    fetch('https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/' + req.params.puuid, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY
        }
    })
    .then(response => {
        if (!response.ok) {
            console.log('❌ League API Status:', response.status);
            throw new Error(`League API Error: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log('✅ League Data received:', result);
        res.json(result);
    })
    .catch(error => {
        console.log('❌ Fetch Error:', error.message);
        res.status(500).json({ error: error.message });
    });
});

app.get("/" , (req ,res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'))
})

app.get("*" , (req ,res) => {
  res.sendFile(path.join(__dirname, '/build', 'index.html'))
})

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Started listening with CORS on port ${port}`);
  });
