import React from 'react';
import './menu.css';

const Game = ({title, image}) => {

    image = image.replace("{width}", "180");
    image = image.replace("{height}", "250");

    if(title === "PLAYERUNKNOWN'S BATTLEGROUNDS"){
        title = title.slice(0, 20 - title.length);
        title += "...";
    }else if(title.length > 21){
        title = title.slice(0, 21 - title.length);
        title += "...";
    }

    return(
        <li className="content-horizontal-row-item">
            <img src={image}></img>
            <span className="nm-collections-title-name">{title}</span>
        </li>
    )
}

export default Game;