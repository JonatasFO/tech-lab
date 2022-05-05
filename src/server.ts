// import express from 'express'

// const app = express()
  
// importação dos modulos http e express 
const http = require('http');
const express = require('express');

const app = express();
app.use(express.json())
const port = 3000;
app.set('port',port)

const server = http.createServer(app);
const router = express.Router();

const route = router.get('/', (req, res, next) => {
    res.status(200).send({ 
       Title: "Api Node, Aula 1 Laboratório",
       version:"0.0.1"
    });
});

app.use('/', route)

app.post('/', (request, response) => {
    const { nome, sobrenome } = request.body;

    response.json({ nome, sobrenome });
});

server.listen(port, () => {
    console.log('O servidor esta rodando na porta', + port)
});