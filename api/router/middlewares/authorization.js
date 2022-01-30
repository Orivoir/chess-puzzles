const jwt = require("jsonwebtoken");
const {getConfig} = require("./../../helper");

function createAuthorization(type = "normal"){

  const jwtConfig = getConfig("jwt");
  const configType = jwtConfig[type?.toLocaleLowerCase()];

  return function(request, response, next){

    // assume JWT as Bearer token at header
    const authorization = request.headers.authorization;

    if(authorization) {
      const token = authorization.split(" ")[1].trim();

      let payload = null;

      try {

        payload = jwt.verify(token, configType.secret, {
          algorithms: [configType.algorithm],
          secret: configType.secret 
        });

        request.authorization = {
          payload,
          token
        };

        next();

      } catch(jsonWebTokenError) {
        response
          .status(401)
          .json({
            success: false,

            // @TODO: in production detail level error should be muted for a generic message
            // for hide text relative to number segments use by algorithm
            message: jsonWebTokenError.message
          });
      }

    } else {
      response
        .status(401)
        .json({
          success: false,
          message: "Authorization header missing"
        });
    }
  };
}

module.exports = createAuthorization;
