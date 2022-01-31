const middlewarePaginator = require("./../middlewares/paginator");
const middlewareGetOneRessource = require("./../middlewares/get-one-ressource");
const {Puzzle} = require("./../../models");

// GET /puzzles/
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

module.exports = {
  get: [middlewareGetOneRessource({
    ressourceName: "Puzzle",
    from: "params",
    documentName: "puzzle",
    populate: "themes"
  })],
  getAll: [middlewarePaginator, getAll],
};