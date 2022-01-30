const {getConfig} = require("./../../helper");

const middlewareAuthorization = require("./../middlewares/authorization");
const middlewareOpenJwtSession = require("./../middlewares/open-jwt-session");

function login(request, response, next){

  const adminCredentials = getConfig("admin");

  const {
    login,
    password
  } = request.body;

  const admin = adminCredentials.find((admin) => (
    admin.login === login && admin.password === password
  ));

  if(admin) {
    request.user = admin;
    next();

  } else {
    response
      .status(200)
      .json({
        success: false,
        message: "Credentials error"
      });
  }
  
}

// GET /admin/refresh
function refreshToken(request, response, next){

  request.user = request.authorization.payload;
  delete request.user.iat;
  delete request.user.exp;
  next();
}

function logout(request, response){

  // @TODO: add revoke token system

  response
    .status(200)
    .json({
      success: true
    });
}

module.exports = {
  login: [login, middlewareOpenJwtSession],
  refreshToken: [
    middlewareAuthorization("refresh"),
    refreshToken,
    middlewareOpenJwtSession
  ],

  // should login before logout
  logout: [middlewareAuthorization(), logout]
};