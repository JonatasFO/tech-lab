const mongoose = require("mongoose");

const Laboratory = mongoose.model("Laboratory", {
  numero: Number,
  quantidadeMaquinas: Number,
  curso: String,
  disponivel: Boolean,
});

module.exports = Laboratory;
