import './menu.css';
import React , { useEffect } from 'react';
import Link from "react-router-dom";
import Game from './Game';

function Menu() {

  //GET AUTH TOKEN
  /*https://dev.twitch.tv/console/apps/
  const getAPITwitch2 = () => {
    
    const url = "https://id.twitch.tv/oauth2/token?client_id=z9uw2j253pkk517utiq99uhf3dt2lf&client_secret=wqwt0wqvt2ihipgpayexy09hot9ipd&grant_type=client_credentials"; 

    fetch(url, {method: "post"})
        .then((response) => {
            console.log(response.json());
        })
  };*/

  //VARIABLES
  const url = "https://api.twitch.tv/helix/games/top?first="; //url to get top games from twitch
  const authorizathion = "Bearer cxaqaqgthxk4ibiy4e7j1m0mzdlndr"; //autentication
  const clientid = "z9uw2j253pkk517utiq99uhf3dt2lf"; //client id


  //STATES
  const [gamedata, setGamedata] = React.useState([]);
  const [searchedgamedata, setSearchedGamedata] = React.useState([]);
  const [gamedataaux, setGamedataaux] = React.useState([]);

  const [pagination, setPagination] = React.useState("");
  const [numberofpages, setNumberofpages] = React.useState(0);

  const [inititemtopgames, setInitTopGames] = React.useState(0); //first position top games
  const [inititemserachgames, setInitSearchGames] = React.useState(0); //last position top games

  var numberofitems = Math.floor(window.innerWidth/180) - 1;

  //Get first 100 games
  const getAPITwitchFirst = () => {

    fetch(url+"100", {
      method: 'get',
      headers: new Headers({
        'Authorization': authorizathion,
        'Client-Id': clientid,
      })})
        .then((response) => { return response.json()})
        .then((data) => {
          let newList = [];

          for (let i = 0; i < data.data.length; i++) {

            newList.push(data.data[i]);

          }

          setGamedata(newList)
          setPagination(data.pagination.cursor);
        })
  };

  //Get next 100 games
  const getAPITwitchNext = () => {

    fetch(url+"100"+"&after="+pagination, {
      method: 'get',
      headers: new Headers({
        'Authorization': authorizathion,
        'Client-Id': clientid,
      })})
        .then((response) => { return response.json()})
        .then((data) => {
          console.log(gamedata)
          let newList = [...gamedata];

          for (let i = 0; i < data.data.length; i++) {

            newList.push(data.data[i]);
            
          }
          
          setGamedata(newList)

          setNumberofpages(numberofpages+1)

          setPagination(data.pagination.cursor);
        })
  };


  //GET INFORMATION TWITCH API
  useEffect(() => {
    getAPITwitchFirst();
  }, []);

  useEffect(() => {

    if(numberofpages !== 3){
      getAPITwitchNext();
    }
    
  }, [pagination]);



  useEffect(() => {

    document.getElementById("prevbutton").style.display = "none";
    document.getElementById("prevsearchbutton").style.display = "none";
    document.getElementById("nextsearchbutton").style.display = "none";
    fillItemsArray();

  }, [gamedata]);



  //Sempre que atualizo a posição do indice
  useEffect(() => {

    //atualiza array com o indice novo
    fillItemsArray();

    //atualiza botoes consoante se tem mais ou menos para mostrar
    if(inititemtopgames != 0){
      document.getElementById("prevbutton").style.display = "block";
    }else{
      document.getElementById("prevbutton").style.display = "none";
    }

    if(gamedata.length != 0 && inititemtopgames + numberofitems  >= gamedata.length){
      document.getElementById("nextbutton").style.display = "none";
    }else{
      document.getElementById("nextbutton").style.display = "block";
    }
    
  }, [inititemtopgames]);


  //preenche array que depois e renderizado
  const fillItemsArray = () => {
    
    numberofitems = Math.floor(window.innerWidth/180) - 1;
    let newList = gamedata.slice(inititemtopgames,inititemtopgames+numberofitems);
    setGamedataaux(newList)

  }

  const fillItemsArraySearched = () => {
    
    numberofitems = Math.floor(window.innerWidth/180) - 1;
    let newList = searchedgamedata.slice(inititemserachgames,inititemserachgames+numberofitems);
    setGamedataaux(newList)

  }
  
  

  //evento botao next para o top games
  const paginationNextTopGames = () => {
    //ao inicio soma-se o numero de items que cabe no ecra
    setInitTopGames(inititemtopgames+numberofitems)
  }

  //evento botao previous para o top games
  const paginationPreviousTopGames = () => {
    //ao inicio subretai-se o numero de items que cabe no ecra
    setInitTopGames(inititemtopgames - numberofitems)
  }

  //evento botao next para o searched games
  const paginationNextSearchedGames = () => {
    setInitSearchGames(inititemserachgames + numberofitems)
  }

  //evento botao previous para o searched games
  const paginationPreviousSearchedGames = () => {
    setInitSearchGames(inititemserachgames - numberofitems)
  }


  //sempre que houver uma mudanca no array atualiza informação
  useEffect(() => {
    fillItemsArraySearched();
  }, [searchedgamedata]);


  //sempre que andar para frente ou para atras atualiza
  useEffect(() => {

    //atualiza array com o indice novo
    fillItemsArraySearched();

    //atualiza botoes consoante se tem mais ou menos para mostrar
    if(inititemserachgames != 0){
      document.getElementById("prevsearchbutton").style.display = "block";
    }else{
      document.getElementById("prevsearchbutton").style.display = "none";
    }

    if(searchedgamedata.length != 0 && inititemserachgames + numberofitems  >= searchedgamedata.length){
      document.getElementById("nextsearchbutton").style.display = "none";
    }else{
      document.getElementById("nextsearchbutton").style.display = "block";
    }
    
  }, [inititemserachgames]);


  //evento da barra de pesquisa sempre que escreve ou remove uma letra
  const search_game = () => {

    let input = document.getElementById('bar').value;
    input = input.toLowerCase();

    setInitSearchGames(0)

    if(!(0 === input.length)){

      //ESVAZIAR O ARRAY QUE MOSTRA ITEMS
      setGamedataaux([])
      //esvaziar o array total da pesquisa porque o input mudou (talvez de para mudar isto)
      setSearchedGamedata([])


      let newList = [];
      //preenche array de dados procurada
      for (let i = 0; i < gamedata.length; i++) {  
        if (gamedata[i].name.toLowerCase().includes(input)) { 
          let game = gamedata[i];
          newList.push(game); 
        }
      }


      //atualiza botoes de next e prev
      document.getElementById("prevbutton").style.display = "none";
      document.getElementById("nextbutton").style.display = "none";
      document.getElementById("prevsearchbutton").style.display = "none";

      if(newList.length >= numberofitems){
        document.getElementById("nextsearchbutton").style.display = "block";
      }else{
        document.getElementById("nextsearchbutton").style.display = "none";
      }
      
      //atualiza lista para chamar evento do useeffect
      setSearchedGamedata(newList)  
  
    }else{

      //atualiza botoes de next e prev
      document.getElementById("prevsearchbutton").style.display = "none";
      document.getElementById("nextsearchbutton").style.display = "none";

      if(inititemtopgames == 0){
        document.getElementById("prevbutton").style.display = "none";
        document.getElementById("nextbutton").style.display = "block";
      }else{
        document.getElementById("prevbutton").style.display = "block";
        document.getElementById("nextbutton").style.display = "block";
      }
    
      fillItemsArray()
    }
  }



  /*const getAPI = () => {

    const url = 'https://localhost:5000/loadData';

    fetch(url)
        .then((response) => {
            console.log(response);
            //return response.json();
        })
        .then((data) => {
            console.log(data);
            setLoading(false);
            setApiData(data);
        });
  };*/



  
  return (
    <div className="page">

      <div className="navbar is-fixed">
        <div className="logo">Time Flies</div>
        <div className="searchbar">
          <input id="bar" type="text" name="search" onKeyUp={search_game} placeholder="Search"/>
        </div>
      </div>
    
      <div className="collections-container">
        <div>
          <section className="collections-row">
            <h1 className="nm-collections-row-name">TOP Games</h1>
            <div className="content-horizontal-row" id="itemsrow">
    
              <div className="nm-content-horizontal-row-nav left">
                <a className="prev" onClick={paginationPreviousTopGames} id="prevbutton">&#10094;</a>
                <a className="prev" onClick={paginationPreviousSearchedGames} id="prevsearchbutton">&#10094;</a>
              </div>

              <ul className="content-horizontal-row-item-container" id="topgames">
                {
                  gamedataaux.map((game,id) =>  (
                    <Game key={id} title={game.name} image={game.box_art_url} />
                  ))
                }
              </ul>

              <div className="nm-content-horizontal-row-nav right">
                <a className="next" onClick={paginationNextTopGames} id="nextbutton">&#10095;</a>
                <a className="next" onClick={paginationNextSearchedGames} id="nextsearchbutton">&#10095;</a>
              </div>
    
            </div>
          </section> 
    
    
          <section className="collections-row">
            <h1 id="titlemygames" className="nm-collections-row-name">My Games</h1>
            <div className="content-horizontal-row" id="itemsrow">

              <ul className="content-horizontal-row-item-container" id="mygames"></ul>

            </div>
          </section> 
        </div>
      </div>
    </div>
  );
}

export default Menu;