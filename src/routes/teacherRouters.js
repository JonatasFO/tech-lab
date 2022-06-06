const router = require("express").Router();

const Teacher = require("../models/Teacher");

router.post("/", async (request, response) => {
  const { name, cpf, matricula, materia } = request.body;

  if (!name) {
    response.starus(422).json({ error: "O campo nome é obrigatório!" });
    return;
  }

  const teacher = {
    name,
    cpf,
    matricula,
    materia,
  };

  try {
    await Teacher.create(teacher);
    response.status(201).json(teacher);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.get("/", async (request, response) => {
  try {
    const teachers = await Teacher.find();

    response.status(200).json(teachers);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.get("/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const teacher = await Teacher.findOne({ _id: id });

    if (!teacher) {
      response
        .status(422)
        .json({ message: " O professor não foi encontrado!" });
      return;
    }

    response.status(200).json(teacher);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.patch("/:id", async (request, response) => {
  const id = request.params.id;

  const { name, cpf, matricula, materia } = request.body;

  const teacher = {
    name,
    cpf,
    matricula,
    materia,
  };

  try {
    const updatedTeacher = await Teacher.updateOne({ _id: id }, teacher);

    if (updatedTeacher.matchedCount === 0) {
      response
        .status(422)
        .json({ message: " O professor não foi encontrado!" });
      return;
    }

    response.status(200).json(teacher);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.delete("/:id", async (request, response) => {
  const id = request.params.id;

  const teacher = await Teacher.findOne({ _id: id });

  if (!teacher) {
    response.status(422).json({ message: " O professor não foi encontrado!" });
    return;
  }

  try {
    await Teacher.deleteOne({ _id: id });
    response.status(200).json({ message: "Professor removido com sucesso! " });
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

module.exports = router;
