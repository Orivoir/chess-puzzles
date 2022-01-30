const {isValidObjectId} = require("mongoose");
const getRessource = require("./../../lib/mongo/get-ressource");

module.exports = function({
  ressourceName, from = "params", documentName = "document"
}){

  const result = getRessource({
    ressourceName,
    from
  });
  const Ressource = result.Ressource;
  from = result.from;

  return function(request, response, next){

    const {id} = request.params;
    
    if(Ressource !== null) {

      if(isValidObjectId(id)) {

        Ressource.deleteOne({
          _id: id 
        })
          .exec()
          .then(deleted => {
            if(deleted.deletedCount == 0) {
              response
                .status(404)
                .json({
                  message: `${documentName} id ${id} not find`,
                  success: false
                });
            } else {
              response
                .status(200)
                .json({
                  message: `${documentName} deleted with success`,
                  success: true
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
    } else {
      next();
    }

  };
};