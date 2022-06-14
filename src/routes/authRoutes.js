const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Register User
router.post("/auth/register", async (request, response) => {
  const { nome, email, senha, confirmarSenha } = request.body;

  if (!nome) {
    return response.status(422).json({ message: "O nome é obrigatório!" });
  }

  if (!email) {
    return response.status(422).json({ message: "O email é obrigatório!" });
  }

  if (!senha) {
    return response.status(422).json({ message: "A senha é obrigatória!" });
  }

  if (senha !== confirmarSenha) {
    return response.status(422).json({ message: "As senhas não conferem!" });
  }

  const usuarioExiste = await User.findOne({ email: email });

  if (usuarioExiste) {
    return response
      .status(422)
      .json({ message: "E-mail já cadastrado. Utilize outro e-mail!" });
  }

  const salt = await bcrypt.genSalt(12);
  const senhaHash = await bcrypt.hash(senha, salt);

  const user = new User({
    nome,
    email,
    senha: senhaHash,
  });

  try {
    await user.save();
    response.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    response.status(500).json({ message: error });
  }
});

//Login User
router.post("/auth/login", async (request, response) => {
  const { email, senha } = request.body;

  if (!email) {
    return response.status(422).json({ message: "O email é obrigatório!" });
  }

  if (!senha) {
    return response.status(422).json({ message: "A senha é obrigatória!" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return response.status(404).json({ message: "Usuário não encontrado!" });
  }

  const validarSenha = await bcrypt.compare(senha, user.senha);

  if (!validarSenha) {
    return response.status(422).json({ message: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    response
      .status(200)
      .json({ message: "Autenticação realizada com sucesso!", token });
  } catch (error) {
    response.status(500).json({ message: error });
  }
});

module.exports = router;
