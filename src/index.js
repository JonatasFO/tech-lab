const http = require("http");
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());
const port = 3000;
app.set("port", port);

const server = http.createServer(app);
const router = express.Router();

mongoose
  .connect(
    "mongodb://localhost:27017/techlab"
  )
  .then(() => {
    console.log("Conectamos ao MongoDB");
    server.listen(port, () => {
      console.log("O servidor esta rodando na porta", +port);
    });
  })
  .catch((error) => console.log(error));

//rotas da API
const teacherRouters = require('./routes/teacherRouters')

app.use('/teacher', teacherRouters);

const route = router.get("/", (req, res, next) => {
  res.status(200).send({
    Title: "Api Node, Aula 1 Laboratório",
    version: "0.0.1",
  });
});

app.use("/", route);

app.post("/", (request, response) => {
  const { nome, sobrenome } = request.body;

  response.json({ nome, sobrenome });
});

// server.listen(port, () => {
//     console.log('O servidor esta rodando na porta', + port)
// });
