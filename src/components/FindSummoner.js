import React, { Component } from 'react';
import SummonerRank from './SummonerRank'
import { Image, Media } from 'react-bootstrap';
import Octicon, {Rocket,Location} from '@githubprimer/octicons-react';

import UserInfoStyles from './styles/UserInfoStyles';
import Section, {Section2} from '../style/Section';
import Corner from './Corner';
import Spinner from '../UI/Spinner';



class FindSummoner extends Component {
    state = {
        username : this.props.username,
        error: null,
        isLoaded: false,
        id: null,
        accountId: null,
        puuid: null,
        name: null,
        profileIconId: null,
        summonerLevel: null,
        test: null,
      };
    
    
    componentDidMount() {
    // const proxyurl = "https://mysterious-wave-96239.herokuapp.com/";
    // const url = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + this.state.username + "?api_key=RGAPI-031ffc06-01a2-4696-9e40-235d76f08cc1"
    
    //  + process.env.REACT_APP_SECRET_KEY; // site that doesn’t send Access-Control-*
      // fetch(proxyurl + url)
         fetch('/api/' + this.state.username)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              id: result.id,
              accountId: result.accountId,
              puuid: result.puuid,
              name: result.name,
              profileIconId: result.profileIconId,
              summonerLevel: result.summonerLevel,
              allInfo: result
            });
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
    const { error, isLoaded, id, name, profileIconId, summonerLevel } = this.state;
    if (error) {
      return <div>{error.message}</div>;
    } else if (!isLoaded) {
      return (<Section2 fullDark><Spinner /></Section2>);
    } else if(isLoaded) {
      return (
        <Section dark>
        {name ?  (
          <UserInfoStyles>
              <Corner />
              <Image className="avatar" src={"https://ddragon.leagueoflegends.com/cdn/10.15.1/img/profileicon/" + profileIconId + ".png"} alt="avatar" roundedCircle/>
              
              <Media.Body>
              <h1>
                <a href={"https://na.op.gg/summoner/userName=" + this.state.name} target="_blank" rel="noopener noreferrer">
                @{name}
                </a>
              </h1>
                
              <div className="info">
                  <span className="info__item">
                    <Octicon icon={Rocket} size="small" />
                    Level: {summonerLevel}
                  </span>

                  <span className="info__item">
                    <Octicon icon={Location} size="small" />
                    Region: North America
                  </span>
                </div>

              <SummonerRank id={id}/>
              </Media.Body>
          </UserInfoStyles>
          

          ) : (
            <UserInfoStyles>
            <Corner />
            <h1>
              Error - Username not found!
            </h1>
            <p>Please press ctrl + R to refresh and try again.</p>
            </UserInfoStyles>
          )}
          </Section>
      );
    }
  }
}
export default FindSummoner;

//psuh test