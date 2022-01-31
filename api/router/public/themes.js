const middlewarePaginator = require("./../middlewares/paginator");
const middlewareGetOneRessource = require("./../middlewares/get-one-ressource");
const {Theme} = require("./../../models");

// GET /themes/
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

module.exports = {
  get: [middlewareGetOneRessource({
    ressourceName: "Theme",
    from: "params",
    documentName: "theme"
  })],
  getAll: [middlewarePaginator, getAll],
};