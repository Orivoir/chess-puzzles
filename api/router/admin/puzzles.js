const {validatePuzzle, validators} = require("./../../lib/validate-puzzle");
const middlewareAuthorization = require("./../middlewares/authorization");
const middlewarePaginator = require("./../middlewares/paginator");
const middlewareGetOneRessource = require("./../middlewares/get-one-ressource");
const middlewareDeleteOneRessource = require("./../middlewares/delete-one-ressource");
const {isValidObjectId} = require("mongoose");

const {Puzzle} = require("./../../models");

// GET /admin/puzzles/
function getAll(request, response){

  let {
    countSkip, limitPerPage, page
  } = request.paginator;

  Puzzle.count()
    .then(countDocuments => {

      if(limitPerPage > countDocuments) {
        limitPerPage = countDocuments;
      }

      const totalPage = Math.ceil(countDocuments / limitPerPage) || 0;

      if(page > totalPage) {
        page = totalPage;
      }

      Puzzle.find({
      })
        .skip(countSkip)
        .limit(limitPerPage)
        .populate("themes")
        .then((documents) => {
          response
            .status(200)
            .json({
              page,
              totalPage,
              totalItems: countDocuments,
              limitPerPage,
              data: documents
            });
        })
        .catch((error) => {
          response
            .status(502)
            .json({
              message: error.message,
              success: false
            });
        });

    })
    .catch((error) => {
      response
        .status(502)
        .json({
          message: error.message,
          success: false
        });
    });

}

// PUT /admin/puzzle/:id
function put(request, response){
  const {id} = request.params;

  if(isValidObjectId(id)) {

    let {
      themes,
      position,
      moves,
      difficulty
    } = request.body;

    const updateProperties = {
    };
    const errors = {
    };

    if(themes) {
      const errorThemes = validators.validateThemes(themes);
      if(errorThemes.error) {
        errors.themes = errorThemes.error;
      } else {
        themes = errorThemes.themesNormalize; 
      }

      updateProperties.themes = themes;
    }
    if(position) {
      const errorPosition = validators.validatePosition(position);
      if(errorPosition) {
        errors.position = errorPosition;
      }

      updateProperties.position = position;
    }
    if(moves) {
      const errorMoves = validators.validateMoves(moves);
      if(errorMoves.error) {
        errors.moves = errorMoves.error;
      } else {
        moves = errorMoves.movesNormalize;
      }

      updateProperties.moves = moves;
    }
    if(difficulty) {
      const errordifficulty = validators.validateDifficulty(difficulty);
      if(errordifficulty) {
        errors.difficulty = errordifficulty;
      }
      updateProperties.difficulty = difficulty;
    }

    const isValid = Object.keys(errors).length === 0;

    if(isValid) {

      if(Object.keys(updateProperties).length !== 0) {
        Puzzle.updateOne({
          _id: id
        }, updateProperties)
          .then(updated => {
            if(updated.matchedCount == 0) {
              response
                .status(404)
                .json({
                  message: `theme with id "${id}" not find`
                });
            } else {
              if(updated.modifiedCount == 0) {
                response
                  .status(200)
                  .json({
                    success: true,
                    message: "update aborted never fields are differents"
                  });
              } else {
                response
                  .status(200)
                  .json({
                    success: true,
                    message: "updated with success"
                  });
              }
            }
          })
          .catch(error => {
            response
              .status(502)
              .json({
                success: false,
                message: error.message
              });
          });
      } else {
        response
          .status(400)
          .json({
            message: "never properties send",
            success: false
          });
      }

    } else {
      response
        .status(400) // Bad Request
        .json({
          success: false,
          message: "fields errors",
          errors
        });  
    }

  } else {
    response
      .status(404)
      .json({
        success: false,
        message: "puzzle id not find",
        id
      });

  }
}

// POST /admin/puzzle
function post(request, response){
  
  const {
    themes,
    position,
    moves,
    difficulty
  } = request.body;

  const validate = validatePuzzle({
    themes,
    position,
    moves,
    difficulty
  });

  if(validate.isValid) {

    const puzzle = new Puzzle({
      themes,
      position,
      moves,
      difficulty
    });

    puzzle.save((error, puzzleCreated) => {
      if(error) {
        response
          .status(502)
          .json({
            message: error.message,
            success: false
          });
      } else {
        response
          .status(201)
          .json({
            success: true,
            puzzle: puzzleCreated
          });
      }
    });

  } else {
    response
      .status(400) // Bad Request
      .json({
        success: false,
        message: "fields errors",
        errors: validate.errors
      });
  }
}

module.exports = {
  get: [middlewareAuthorization(), middlewareGetOneRessource({
    ressourceName: "Puzzle",
    from: "params",
    documentName: "puzzle",
    populate: "themes"
  })],
  getAll: [middlewareAuthorization(), middlewarePaginator, getAll],
  put: [middlewareAuthorization(), put],
  post: [middlewareAuthorization(), post],
  delete: [middlewareAuthorization(), middlewareDeleteOneRessource({
    ressourceName: "Puzzle",
    documentName: "puzzle",
    from: "params"
  })]
};