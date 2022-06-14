const mongoose = require("mongoose");

const Reservation = mongoose.model("Reservation", {
  numeroLab: Number,
  quantidadeMaquinas: Number,
  curso: String,
});

module.exports = Reservation;
