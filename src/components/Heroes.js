import React from 'react';
import { Image, Media } from 'react-bootstrap';

const Heroes = (props) => {

    return (
        <Media>
            <Image className="mr-3" src={"https://ddragon.leagueoflegends.com/cdn/img/champion/loading/" + props.hero + "_0.jpg"} alt="props.hero" rounded/>
                <Media.Body>
                    <h5>{props.hero + " " + props.title}</h5>
                        <p>
                        {props.blurb}<a href="/#" onClick={() => window.open("https://na.leagueoflegends.com/en-us/champions/" + props.hero.toLowerCase() + "/")}>Read More</a>
                        </p>
                </Media.Body>
        </Media>
    )
}
    


export default Heroes