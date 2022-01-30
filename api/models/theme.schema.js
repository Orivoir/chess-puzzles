const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  name: mongoose.Schema.Types.String
}, {
  versionKey: false
});

const Theme = mongoose.model("Theme", themeSchema);

module.exports = Theme;
