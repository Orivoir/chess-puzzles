const {getConfig} = require("./../../helper");
const mongoose = require("mongoose");

module.exports = async function(){

  const mongoConfig = getConfig("mongo");

  const dbUrl = `${mongoConfig.connection.protocol}${mongoConfig.readAndWrite.login}:${mongoConfig.readAndWrite.password}@${mongoConfig.connection.hostname}/${mongoConfig.connection.dbname}?retryWrites=true&w=majority`;

  return await mongoose.connect(dbUrl);
};