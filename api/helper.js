const getConfig = name => {

  name = name.toLocaleLowerCase();

  switch(name) {
  case "jwt":
    return require("./config/private/jwt.json");
  case "mongo":
    return require("./config/private/mongo-db.json");
  case "admin":
    return require("./config/private/admin.json");
  default:
    throw new RangeError(`config name unknown for: ${name}`);
  }
};

const PUZZLE_MIN_DIFFICULTY = 300;
const PUZZLE_MAX_DIFFICULTY = 3600;
const PUZZLE_THEME_PATTERN_NAME = /^[a-z ]{3,256}$/i;

module.exports = {
  getConfig,

  PUZZLE: {
    PUZZLE_THEME_PATTERN_NAME,
    PUZZLE_MIN_DIFFICULTY,
    PUZZLE_MAX_DIFFICULTY
  }
};