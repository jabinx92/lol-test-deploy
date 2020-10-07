import React, {Component} from 'react';
import {Bar
  // ,Line
  ,Pie} from 'react-chartjs-2';
import ChartStyles from './styles/ChartsStyles';
import  Section  from '../style/Section';
import TopChampMaps from './TopChampMaps';
import Footer from './Footer'

//450 - aram
//900 - urf
//440 - ranked flex
//420 - ranked solo/duo
//1300 - blind pick
//400 - normal draft 

class ChartData extends Component {
    state = {
            error: null,
            isLoaded: false,
            accountId: this.props.accountId,
            matchHistory: [],
            chartData: {},
            championLibrary: {},
            championList:[],
            pieData: {},
            queueData: {},
            championJSON: null,
            repoData: null
        }
    

    componentDidMount = () => {
        this.getMatchHistory();
    }

    getMatchHistory = () => {
        let championList = [];
        let queueObj = {};
        if(!this.state.accountId) {return}
        // const proxyurl = "https://mysterious-wave-96239.herokuapp.com/";
        // const url = "https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/" + this.state.accountId + "?endIndex=20&api_key=RGAPI-031ffc06-01a2-4696-9e40-235d76f08cc1" 
        fetch(`/api/getHero/${this.state.accountId}`)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                  isLoaded: true
                }
                )
                if(result.matches) {
                  Object.entries(result.matches).map(([x,championId]) => 
                  championList.push(championId.champion.toString())
                  )
                  Object.entries(result.matches).map(([x,championId]) => {
                    if(championId.queue === 450) {
                      if(queueObj.ARAM === undefined) {
                        queueObj.ARAM = 1
                      } else if (queueObj.ARAM !== undefined) {
                        queueObj.ARAM += 1
                      }
                    } else if(championId.queue === 900) {
                      if(queueObj.URF === undefined) {
                        queueObj.URF = 1
                      } else if (queueObj.URF !== undefined) {
                        queueObj.URF += 1
                      }
                    } else if(championId.queue === 440) {
                      if(queueObj["Ranked Flex"] === undefined) {
                        queueObj["Ranked Flex"] = 1
                      } else if (queueObj["Ranked Flex"] !== undefined) {
                        queueObj["Ranked Flex"] += 1
                      }
                    } else if(championId.queue === 420) {
                      if(queueObj["Ranked Solo/Duo"] === undefined) {
                        queueObj["Ranked Solo/Duo"] = 1
                      } else if (queueObj["Ranked Solo/Duo"] !== undefined) {
                        queueObj["Ranked Solo/Duo"] += 1
                      }
                    } else if(championId.queue === 1300) {
                      if(queueObj["Blind Pick"] === undefined) {
                        queueObj["Blind Pick"] = 1
                      } else if (queueObj["Blind Pick"] !== undefined) {
                        queueObj["Blind Pick"] += 1
                      }
                    } else if(championId.queue === 400) {
                      if(queueObj["Normal Draft"] === undefined) {
                        queueObj["Normal Draft"] = 1
                      } else if (queueObj["Normal Draft"] !== undefined) {
                        queueObj["Normal Draft"] += 1
                      }
                    }
                    return queueObj
                  })
                  this.getQueueChart(queueObj)
                  this.getHeroJson(championList)
                  this.setState({
                    championList: championList
                  })
                }
            },
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

    getHeroJson = (championList) => {
      let championObj = {}
      let roleObj = {};
      // const proxyurl = "https://mysterious-wave-96239.herokuapp.com/";
        const url = "https://ddragon.leagueoflegends.com/cdn/10.15.1/data/en_US/champion.json";
          fetch(url) 
            .then(response => response.json())
            .then(contents => {
                  this.setState({championJSON : contents})
                  Object.entries(contents.data).map(([key, value]) => 
                    championObj[value.key] = [value.name].toString()
                  )
                  Object.entries(contents.data).map(([key, value]) => {
                    if(roleObj[value.tags[0]] === undefined) {
                      roleObj[value.tags[0]] = 1
                    } else if (roleObj[value.tags[0]] !== undefined){
                      roleObj[value.tags[0]] += 1 
                    }
                    return roleObj
                  })
                  this.getPieChartData(roleObj)
                  this.matchHeroes(championObj, championList)
            })
            .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    }

    getPieChartData = (roleObj) => {
        this.setState({
          pieData:{
            labels: Object.keys(roleObj),
            datasets:[
              {
                label:'Population',
                data: Object.values(roleObj),
                backgroundColor:[
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)'
                ]
              }
            ]
          }
        });
    }

    getQueueChart = (queueObj) => {
      if(queueObj === {}) {
        this.setState({queueData: {}})
        return
      }
        this.setState({
          queueData:{
            labels: Object.keys(queueObj),
            datasets:[
              {
                label:'Games Played',
                data: Object.values(queueObj),
                backgroundColor:[
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)'
                ]
              }
            ]
          }
        });
    }
 
    matchHeroes = (championObj, championList) => {
      let obj = {}
      //loop over championList array to compare with championObj object
      for (var i = 0; i < championList.length; i++) {
      //if the index is not in the object, add it into empty object and make the value 1
      if (obj[championObj[championList[i]]] === undefined) {
        obj[championObj[championList[i]]] = 1
        //else if the index is already found in the object, increment the value by + 1 
      } else if (obj[championObj[championList[i]]] !== undefined) {
        obj[championObj[championList[i]]] += 1
      }
    }
    //return the object
    this.getChartData(obj)
    this.getMappedHeroes(obj)
    }


    getChartData = (obj) => {
        this.setState({
          chartData:{
            labels: Object.keys(obj),
            datasets:[
              {
                label:'Count',
                data: Object.values(obj),
                backgroundColor:[
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(153, 102, 255, 0.6)',
                  'rgba(255, 159, 64, 0.6)',
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                ]
              }
            ]
          }
        });
      }

      getMappedHeroes = (obj) => {
        let emptyArray = [];
        for(var key in obj) {
          if(this.state.championJSON.data[key]) {
          emptyArray.push({
            id: this.state.championJSON.data[key].key,
            name: this.state.championJSON.data[key].id,
            html_url: `https://na.leagueoflegends.com/en-us/champions/${key.toLowerCase()}/`,
            description: this.state.championJSON.data[key].title,
            language: this.state.championJSON.data[key].tags[0],
            attack: this.state.championJSON.data[key].info.attack,
            defense: this.state.championJSON.data[key].info.defense,
            difficulty: this.state.championJSON.data[key].info.difficulty
          })
          }
        }
        return this.setState({
          repoData: emptyArray
        });

      }

    static defaultProps = {
        displayTitle: true,
        displayLegends: true,
        legendPosition: 'right'
    }
    
    render () {
        return (
          <div>

          <Section>
            <ChartStyles>
              <div className="chart">
              <div className="chart-container">
              <header>
              <h2>Top Champions in 20 Games</h2>
              </header>
                {this.state.accountId ? 
                <Bar
                data={this.state.chartData}
                width={100}
                height={100}
                options={{
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true,
                        callback: function (value) { if (Number.isInteger(value)) { return value; } }
                      }
                    }]
                  },
                  title: {
                    display: this.props.displayTitle,
                    fontSize: 25
                  },
                  legend: {
                    display: this.props.displayLegend,
                    position: this.props.legendPosition
                  }
                }}
                /> : <h3>Nothing to show!</h3>}
              </div>
              </div>

              <div className="chart">
              <header>
              <h2>Top Game Modes Played</h2>
              </header>
              <div className="chart-container">
                {this.state.accountId ? 
                <Pie
                data={this.state.queueData}
                width={100}
                height={100}
                options={{
                  title: {
                    display: this.props.displayTitle,
                    fontSize: 25
                  },
                  legend: {
                    display: true,
                    position: 'right'
                  }
                }}
                />: <h3>Nothing to show!</h3>}
              </div>
              </div>

              <div className="chart">
              <header>
              <h2>Total Champion Roles</h2>
              </header>
              <div className="chart-container">
              {this.state.accountId ?  
                <Pie
                data={this.state.pieData}
                width={100}
                height={100}
                options={{
                  scales: {
                  },
                  title: {
                    display: true
                  },
                  legend: {
                    display: true,
                    position: 'right'
                  }
                }}
                /> : <h3>Nothing to show!</h3> }
              </div>
              </div>
            </ChartStyles>
          </Section>
          {this.state.repoData ? <TopChampMaps repoData={this.state.repoData}/> : ''}
          {this.state.repoData ? <Footer /> : ''}

        </div>
        )
    }
}
export default ChartData