import React, { Component } from 'react';
import { Image, Media } from 'react-bootstrap';

class SummonerRank extends Component {
    state = {
        error: null,
        isLoaded: false,
        id: this.props.id,
        stats: []
    };

    ranks = {
        IRON: "Iron",
        BRONZE: "Bronze",
        SILVER: "Silver",
        GOLD: "Gold",
        PLATINUM: "Platinum",
        DIAMOND: "Diamond",
        MASTER: "Master",
        GRANDMASTER: "Grandmaster",
        CHALLENGER: "Challenger"
    };
    componentDidMount() {

        fetch(`/api/summonerRank/${this.state.id}`)
            .then(res => res.json())
            .then(result => {
                this.setState({
                    isLoaded: true,
                    stats: result
                });
            })
            .catch(() => {
                this.setState({
                    isLoaded: true,
                    error: { message: "Error - Something went wrong!" }
                });
            });
    }
  
  render() {
    const { error, isLoaded, stats } = this.state;
    
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div> </div>;
    }
    
    return (
      <Media>
        {stats.length ? (
          <div>
            <Image width="250" src={"ranked-emblems/" + stats[0].tier + ".png"} alt={stats[0].tier} rounded fluid />
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
                <span className="num">{Math.round((stats[0].wins / (stats[0].wins + stats[0].losses)) * 100)}%</span>
                <span className="num-label">Win Percent</span>
              </div>
              <div className="stats__item">
                <span className="num">{this.ranks[stats[0].tier]}</span>
                <span className="num-label">Tier</span>
              </div>
              <div className="stats__item">
                <span className="num">{stats[0].rank}</span>
                <span className="num-label">Rank</span>
              </div>
            </div>
          </div>
        ) : (
          <h2>User has not played any ranked games yet!</h2>
        )}
      </Media>
    );
  }
}
export default SummonerRank;