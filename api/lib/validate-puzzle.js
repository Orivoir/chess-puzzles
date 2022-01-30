const {PUZZLE} = require("./../helper");

const {Chess} = require("chess.js");
const {isValidObjectId} = require("mongoose");

const validateThemes = (themes) => {
  
  if(!(themes instanceof Array)) {
    return {
      error: "required fields string[] theme id"
    };
  } else {
    themes = themes.filter((theme => (
      isValidObjectId(theme)
    )));

    if(themes.length == 0) {
      return {
        error: "required fields themes string[] cannot be empty valid data",
      };
    }

    return {
      themesNormalize: themes
    };
  }

};
const validatePosition = (position) => {
  
  const chessRefeere = new Chess(position);
  
  if(typeof position !== "string") {
    return "required field string";
  } else {
    const validateFen = chessRefeere.validate_fen(position);
    if(!validateFen.valid) {
      return `required field string chess position FEN notation contains ${validateFen.error_number} errors, assume as standard variantion chess`;
    } else {
      chessRefeere.fen();
      if(chessRefeere.game_over()) {
        return "FEN is valid but already finished position";
      }

      return null;
    }
  }

};
const validateMoves = (moves) => {
  
  if(!(moves instanceof Array)) {
    return {
      error: "required field string[] solution puzzle full UCI move notation \"from-to\" (e.g: \"e2-e4\")"
    };
  } else {
    moves = moves.filter(move => (
      typeof move === "string" && move.indexOf("-") !== -1
    ));

    if(moves.length == 0) {
      return {
        error: "required field string[] cannot be empty valid data"
      };
    }

    return {
      movesNormalize: moves
    };
  }
};
const validateDifficulty = (difficulty) => {
  
  if(
    !(typeof difficulty == "number" &&
    isFinite(difficulty) && // !== Infinity
    !isNaN(difficulty) && // !== NaN
    difficulty >= PUZZLE.PUZZLE_MIN_DIFFICULTY &&
    difficulty <= PUZZLE.PUZZLE_MAX_DIFFICULTY)
  ) {
    return `required field number between ${PUZZLE.PUZZLE_MIN_DIFFICULTY} and ${PUZZLE.PUZZLE_MAX_DIFFICULTY}`;
  }
  return null;
}; 

const validatePuzzle = (puzzle) => {

  if(typeof puzzle !== "object" || puzzle === null) {
    throw new RangeError("arg1 should be a object");
  }

  let {
    themes, // ObjectId[]
    position, // string FEN position
    moves, // string[] solution puzzle full UCI move notation "from-to" (e.g: "e2-e4")
    difficulty // number chess ELO ranking system  
  } = puzzle;

  const errors = {
  };

  difficulty = parseInt(difficulty);

  const errorDifficulty = validateDifficulty(difficulty);

  if(errorDifficulty) {
    errors.difficulty = errorDifficulty;
  }

  const errorPosition = validatePosition(position);

  if(errorPosition) {
    errors.position = errorPosition;
  }

  const errorMoves = validateMoves(moves);

  if(errorMoves.error) {
    errors.moves = errorMoves.error;
    moves = [];
  } else {
    moves = errorMoves.movesNormalize;
  }

  const errorThemes = validateThemes(themes);

  if(errorThemes.error) {
    errors.themes = errorThemes.error;
    themes = [];
  } else {
    themes = errorThemes.themesNormalize;
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors: isValid ? null : errors,
    fieldsNormalize: {
      themes,
      moves,
      difficulty,
      position
    }
  };
};

module.exports = {
  validatePuzzle,
  validators: {
    validateThemes,
    validatePosition,
    validateMoves,
    validateDifficulty
  }
};
