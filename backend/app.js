var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('Files/certicates/privateKey.key', 'utf8');
var certificate = fs.readFileSync('Files/certicates/certificate.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const express = require('express')
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 5000

var httpsServer = https.createServer(credentials, app);

const { Client } = require('pg');
const connectionString = 'postgres://postgres:postgres@localhost:5432/postgres';
const client = new Client({
    connectionString: connectionString
});

client.connect();

app.use(express.static("Files"))
app.use(cookieParser())
app.use(bodyParser.json())

const accessTokenSecret = 'youraccesstokensecret';


//quando o utilizador pede para logar
app.get('/login', (req, res) => {

  //headers com informação do utilizador
  let datareceived = req.headers;

  //query para ir verificar informacao
  const querylogin= {
    text: 'SELECT name, token FROM person WHERE name = $1 AND password = $2',
    values: [datareceived.username, datareceived.password],
  }

  //query a database
  client.query(querylogin, function (err, result) {
    if (err) {
        console.log(err);
        res.status(400).send("error");
    }
    
    //se devolveu alguma coisa entao existe
    if(result.rowCount == 1){

      //verifica token com o secret
      jwt.verify(result.rows[0].token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        
        //verifica informação fornecida pelo o utilizador e o resultado com user retirado do token
        if(user.username === datareceived.username){
          //cria as cookies
          res.cookie("token", result.rows[0].token, {expire: 100 + Date.now()});
          res.cookie("username", user.username, {expire: 100 + Date.now()});
          res.status(200).send("yesuser");
        }

      });
    }else{
      //nao existe 
      res.status(200).send("nouser");
    }

  });
})

app.get('/register', (req, res) => {

  let datareceived = req.headers;
  
  const accessToken = jwt.sign({ username: datareceived.username}, accessTokenSecret);

  const queryregister= {
    text: 'INSERT INTO person VALUES ($1, $2, $3)',
    values: [datareceived.username, datareceived.password,accessToken],
  }

  client.query(queryregister, function (err, result) {
    if (err) {
        console.log(err);
        res.status(400).send("taken");
    }
    res.cookie("token", accessToken, {expire: 3600 + Date.now()});
    res.cookie("username", datareceived.username, {expire: 3600 + Date.now()});
    res.status(200).send("registed");
  });
})


app.get('/loadData', (req, res) => {

  let datareceived = req.headers;

  const queryloadata = {
    text: 'SELECT game.id , game.name, game.url FROM game, person_game, person WHERE person.token = $1 AND person.name = $2 AND person_name = person.name AND game.id = person_game.game_id',
    values: [datareceived.token, datareceived.username],
  }

  client.query(queryloadata, function (err, result) {
    if (err) {
        console.log(err);
        res.status(400).send("erro");
    }

    if(result.rowCount != 0){
      res.json(result.rows);
    }

  });

})

app.post('/saveGame', (req, res) => {

  let datareceived = req.query;
  let datareceivedheaders = req.headers;

  //inserir jogo caso nao ainda esteja inserido
  const queryinsertgame = {
    text: 'INSERT INTO game VALUES($1, $2, $3)',
    values: [datareceived.id, datareceived.name, datareceived.box_art_url],
  }

  //verificar que jogo ja existe
  const queryverifygame = {
    text: 'SELECT * FROM game WHERE id = $1',
    values: [datareceived.id],
  }

  //verifica informação da pessoa
  const verifyperson= {
    text: 'SELECT name, token FROM person WHERE name = $1 AND token = $2',
    values: [datareceivedheaders.username, datareceivedheaders.token],
  }

  //associa o jogo a pessoa
  const queryinsert = {
    text: 'INSERT INTO person_game VALUES($1, $2)',
    values: [datareceivedheaders.username ,datareceived.id],
  }




  //query verificacao da pessoa
  client.query(verifyperson, function (err, result) {
    if (err) {
        console.log(err);
        res.status(400).send(err);
    }




    //verifica token com o secret
    jwt.verify(result.rows[0].token, accessTokenSecret, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }



      //verifica informação fornecida pelo o utilizador e o resultado com user retirado do token
      if(user.username === result.rows[0].name){
        


        //query verifica se jogo ja existe na base de dados
        client.query(queryverifygame, function (err, result) {
          if (err) {
              console.log(err);
              res.status(400).send("erro");
          }
          
          //se o jogo ainda nao esta na base de dados
          if(result.rows.length == 0){

            //inserir jogo
            client.query(queryinsertgame, function (err, result) {
              if (err) {
                  console.log(err);
                  res.status(400).send(err);
              }
              
              //inserir associacao
              client.query(queryinsert, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                }

                //response
                res.status(200).send("inserted");
              });
            });
          }else{ //ja esta na base de dados entao so se associa
          
            //query que associa
            client.query(queryinsert, function (err, result) {
              if (err) {
                  console.log(err);
                  res.status(400).send(err);
              }

              //response
              res.status(200).send("inserted");
            });
          }
        });
      }
    });
  });
})

httpsServer.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`)
})
