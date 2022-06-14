const router = require("express").Router();

const Laboratory = require("../models/Laboratory");

router.post("/", async (request, response) => {
  const { numero, quantidadeMaquinas, curso, disponivel } = request.body;

  if (!numero) {
    response.status(422).json({ error: "O campo numero é obrigatório!" });
    return;
  }

  const laboratory = {
    numero,
    quantidadeMaquinas,
    curso,
    disponivel,
  };

  try {
    await Laboratory.create(laboratory);
    response.status(201).json(laboratory);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

router.get("/", async (request, response) => {
  try {
    const laboratories = await Laboratory.find();

    response.status(200).json(laboratories);
  } catch (error) {
    response.status(500).json({ error: error });
  }
});

// router.get("/:id", async (request, response) => {
//   const id = request.params.id;

//   try {
//     const teacher = await Teacher.findOne({ _id: id });

//     if (!teacher) {
//       response
//         .status(422)
//         .json({ message: " O professor não foi encontrado!" });
//       return;
//     }

//     response.status(200).json(teacher);
//   } catch (error) {
//     response.status(500).json({ error: error });
//   }
// });

// router.patch("/:id", async (request, response) => {
//   const id = request.params.id;

//   const { name, cpf, matricula, materia } = request.body;

//   const teacher = {
//     name,
//     cpf,
//     matricula,
//     materia,
//   };

//   try {
//     const updatedTeacher = await Teacher.updateOne({ _id: id }, teacher);

//     if (updatedTeacher.matchedCount === 0) {
//       response
//         .status(422)
//         .json({ message: " O professor não foi encontrado!" });
//       return;
//     }

//     response.status(200).json(teacher);
//   } catch (error) {
//     response.status(500).json({ error: error });
//   }
// });

// router.delete("/:id", async (request, response) => {
//   const id = request.params.id;

//   const teacher = await Teacher.findOne({ _id: id });

//   if (!teacher) {
//     response.status(422).json({ message: " O professor não foi encontrado!" });
//     return;
//   }

//   try {
//     await Teacher.deleteOne({ _id: id });
//     response.status(200).json({ message: "Professor removido com sucesso! " });
//   } catch (error) {
//     response.status(500).json({ error: error });
//   }
// });

module.exports = router;
