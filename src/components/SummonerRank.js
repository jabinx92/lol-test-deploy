import React, { Component } from 'react';
import { Image, Media } from 'react-bootstrap';

class SummonerRank extends Component {
    state = {
        error: null,
        isLoaded: false,
        id: this.props.id,
        stats: []
      };
    
  
    componentDidMount() {
    // const proxyurl = "https://mysterious-wave-96239.herokuapp.com/";
    // const url = "https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + this.state.id + "?api_key=RGAPI-031ffc06-01a2-4696-9e40-235d76f08cc1"
    //  +process.env.REACT_APP_SECRET_KEY;
    // site that doesn’t send Access-Control-*
        fetch(`/api/summonerRank/${this.state.id}`) // https://mysterious-wave-96239.herokuapp.com/https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              stats: result
            }
            // ,console.log(result)
            );
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            this.setState({
              isLoaded: true,
              error: {
                message: "Error - Something went wrong!"
              }
            });
          }
        )
    }
  
  render() {
    
    let ranks = {
      "IRON": "Iron",
      "BRONZE": "Bronze",
      "SILVER": "Silver",
      "GOLD": "Gold",
      "PLATINUM": "Platinum",
      "DIAMOND": "Diamond",
      "MASTER": "Master",
      "GRANDMASTER": "Grandmaster",
      "CHALLENGER": "Challenger"

    }


    const { error, isLoaded, stats } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div> </div>;
    } else if(isLoaded) {
      return (
        <Media>
        {stats.length ?  (
          <div>
            <Image width="250" src={"ranked-emblems/"+stats[0].tier+".png"} alt={stats[0].tier} rounded fluid/>
            <div className="stats">
            <div className="stats__item">
              <span className="num">{stats[0].losses + stats[0].wins}</span>
              <span className="num-label">Total Games</span>
            </div>
            <div className="stats__item">
              <span className="num">{stats[0].wins}</span>
              <span className="num-label">Wins</span>
            </div>
            <div className="stats__item">
              <span className="num">{stats[0].losses}</span>
              <span className="num-label">Losses</span>
            </div>
            <div className="stats__item">
              <span className="num">{Math.round(stats[0].wins / (stats[0].wins + stats[0].losses) * 100)}%</span>
              <span className="num-label">Win Percent</span>
            </div>
            <div className="stats__item">
              <span className="num">{ranks[stats[0].tier]}</span>
              <span className="num-label">Tier</span>
            </div>
            <div className="stats__item">
              <span className="num">{stats[0].rank}</span>
              <span className="num-label">Rank</span>
            </div>
            </div>
            </div>
          ) : (
            <h2>
              User has not played any ranked games yet!
            </h2>
          )}
          </Media>
      );
    }
  }
}
export default SummonerRank;