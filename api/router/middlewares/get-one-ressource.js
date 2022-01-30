const {isValidObjectId} = require("mongoose");
const getRessource = require("./../../lib/mongo/get-ressource");

module.exports = function({
  ressourceName,
  from = "params",
  documentName = "document",
  populate
}){

  const result = getRessource({
    ressourceName, from
  });

  const Ressource = result.Ressource;
  from = result.from;

  return function(request, response, next){

    if(Ressource == null) {
      next();
    } else {
      const {id} = request[from];

      if(isValidObjectId(id)) {
        const cursorRequest = Ressource
          .findById(id);

        if(populate) {
          cursorRequest.populate(populate);
        }

        cursorRequest
          .exec()
          .then(document => {
            if(document) {
              response
                .status(200)
                .json({
                  [documentName]: document,
                  success: true
                });

            } else {
              // 404
              response
                .status(404)
                .json({
                  message: `${documentName} id ${id} not find`,
                  success: false
                });
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
          .status(400) // Bad request
          .json({
            message: "format id invalid",
            success: false
          });
      }
    }
  };
};