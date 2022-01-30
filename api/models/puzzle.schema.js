const mongoose = require("mongoose");

const puzzleSchema = new mongoose.Schema({
  themes: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Theme"
  }],
  position: mongoose.Schema.Types.String,
  difficulty: mongoose.Schema.Types.Number,
  moves: [mongoose.Schema.Types.String]
}, {
  versionKey: false
});

const Puzzle = mongoose.model("Puzzle", puzzleSchema);

module.exports = Puzzle; 
