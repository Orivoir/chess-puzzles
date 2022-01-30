const middlewareAuthorization = require("./../middlewares/authorization");
const middlewarePaginator = require("./../middlewares/paginator");
const middlewareGetOneRessource = require("./../middlewares/get-one-ressource");
const middlewareDeleteOneRessource = require("./../middlewares/delete-one-ressource");

const {PUZZLE: {PUZZLE_THEME_PATTERN_NAME}} = require("./../../helper");
const {Theme} = require("./../../models");
const {isValidObjectId} = require("mongoose");

// GET /admin/themes/
function getAll(request, response){

  let {
    countSkip, limitPerPage, page
  } = request.paginator;

  Theme.count()
    .then(countDocuments => {

      if(limitPerPage > countDocuments) {
        limitPerPage = countDocuments;
      }

      const totalPage = Math.ceil(countDocuments / limitPerPage);

      if(page > totalPage) {
        page = totalPage;
      }

      Theme.find({
      })
        .skip(countSkip)
        .limit(limitPerPage)
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

// PUT /admin/theme/:id
function put(request, response){
  const {id} = request.params;
  const {name} = request.body;

  if(isValidObjectId(id)) {

    if(typeof name === "string" && PUZZLE_THEME_PATTERN_NAME.test(name)) {
      Theme.updateOne({
        _id: id
      }, {
        name
      })
        .exec()
        .then((updated) => {
  
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
              message: error.message,
              success: false
            });
        });
    } else {
      response
        .status(400)
        .json({
          message: "name fields format error",
          name,
          pattern: PUZZLE_THEME_PATTERN_NAME.source
        });
    }


  } else {
    response
      .status(400) // Bad request
      .json({
        message: "format id invalid",
        success: false
      });
  }
}

// POST /admin/theme
function post(request, response){

  const {name} = request.body;

  if(PUZZLE_THEME_PATTERN_NAME.test(name)) {

    const theme = new Theme({
      name
    });

    theme.save((error, themeCreated) => {
      if(error) {
        response
          .status(502)
          .json({
            success: false,
            message: error.message
          });
      } else {
        response
          .status(201)
          .json({
            success: true,
            theme: themeCreated
          });
      }
    });

  } else {
    response
      .status(400)
      .json({
        message: "name fields format error",
        name,
        pattern: PUZZLE_THEME_PATTERN_NAME.source
      });
  }
}


module.exports = {
  get: [middlewareAuthorization, middlewareGetOneRessource({
    ressourceName: "Theme",
    from: "params",
    documentName: "theme"
  })],
  getAll: [middlewareAuthorization, middlewarePaginator, getAll],
  put: [middlewareAuthorization, put],
  post: [middlewareAuthorization, post],
  delete: [middlewareAuthorization, middlewareDeleteOneRessource({
    ressourceName: "Theme",
    documentName: "theme",
    from: "params"
  })]
};