const express = require("express");
const router = express();
const server = require("http").Server(router);
const createRoutes = require("./router");
const createDao = require("./lib/mongo/dao");

const bodyParser = require("body-parser");

let isReady = false;

// reject request while mongoDB connection not ready
router.use((request, response, next) => {
  if(!isReady) {
    response.status(500).json({
      success: false,
      message: "try again later"
    });
  } else {
    next();
  }
});

createDao()
  .then(connection => {
    isReady = true;
    console.log("> Mongo DB connection open");
    router.dao = connection;
    process.emit("mongo-connected", connection);
  })
  .catch(error => {
    server.close();
    console.log(`> Mongo DB connection has fail with: ${error.message}`);
  });

router.use(bodyParser.json({
  limit: "50kb"
}));

createRoutes(router);

const httpListener = server.listen(process.env.PORT || 3000, () => {
  console.log(`> HTTP server open at port ${httpListener.address().port}`);
});

// exported for testing
module.exports = {
  router,
  server
};
