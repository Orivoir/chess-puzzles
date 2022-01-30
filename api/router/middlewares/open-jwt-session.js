const {getConfig} = require("./../../helper");
const jwt = require("jsonwebtoken");

module.exports = function(request, response){

  const jwtConfig = getConfig("jwt");
  const {normal, refresh} = jwtConfig;

  const token = jwt.sign(
    request.user,
    normal.secret,
    {
      algorithm: normal.algorithm,
      expiresIn: normal.expires
    }
  );
  const refreshToken = jwt.sign(
    request.user,
    refresh.secret,
    {
      algorithm: refresh.algorithm,
      expiresIn: refresh.expires
    }
  );

  const normalExpiresAt = Date.now() + (normal.expires * 1000);
  const refreshExpiresAt = Date.now() + (refresh.expires * 1000);

  response
    .status(200)
    .json({
      success: true,
      token: {
        value: token,
        expiresAt: normalExpiresAt
      },
      refreshToken: {
        value: refreshToken,
        expiresAt: refreshExpiresAt
      }
    });
};