const serverlessExpress = require("@codegenie/serverless-express");
const app = require("./src/index.js");

exports.handler = serverlessExpress({ app });
