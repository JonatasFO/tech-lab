require("dotenv").config();
const http = require("http");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

// console.log(mongoose.Types.ObjectId.isValid('62a384b474b13ff98f083082'));

const app = express();

app.use(express.json());
const port = 3000;
app.set("port", port);

const server = http.createServer(app);
const router = express.Router();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Conectamos ao MongoDB");
    server.listen(port, () => {
      console.log("O servidor esta rodando na porta", +port);
    });
  })
  .catch((error) => console.log(error));

const User = require("./models/User");
const Laboratory = require("./models/Laboratory");
const Reservation = require("./models/Reservation");

//rotas da API
const teacherRouters = require("./routes/teacherRouters");
const authRouters = require("./routes/authRoutes");
const laboratoryRouters = require("./routes/laboratoryRouters");

app.use(authRouters);
app.use("/teacher", teacherRouters);
app.use("/laboratory", laboratoryRouters);

//Open Routes
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

// Private Routes
router.get("/user/:id", verificaToken, async (request, response) => {
  const id = request.params.id;

  const user = await User.findById(id, "-senha");

  console.log(user);

  if (!user) {
    return response.status(404).json({ message: "Usuário não encontrado!" });
  }

  response.status(200).json({ user });
});

router.get("/lab/disponiveis", verificaToken, async (request, response) => {
  try {
    const laboratories = await Laboratory.find({ disponivel: true });
    response.status(200).json(laboratories);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.get("/lab/:id", verificaToken, async (request, response) => {
  const id = request.params.id;

  const laboratory = await Laboratory.findOne({ _id: id });

  if (!laboratory) {
    response.status(422).json({ message: "Laboratório não encontrado!" });
    return;
  }

  const reservation = {
    numeroLab: laboratory.numero,
    quantidadeMaquinas: laboratory.quantidadeMaquinas,
    curso: laboratory.curso,
  };

  try {
    await Reservation.create(reservation);
    response.status(201).json(reservation);
  } catch (error) {
    response.status(500).json({ error: error });
  }

  laboratory.disponivel = false;

  await Laboratory.updateOne({ _id: id }, laboratory);
});

function verificaToken(request, response, next) {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader);

  if (!token) {
    return response.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    return response.status(400).json({ message: "Token inválido!" });
  }
}
