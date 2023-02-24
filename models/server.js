const express = require("express");
const route = require("../routes/routes");
const cors = require("cors")
const path = require("path")
class Server {
  constructor() {
    this.index = express();
    this.index.use(express.static(path.join(__dirname,"../public/")))
    this.index.use(express.json())
    this.index.use(route);
    this.index.use(cors());
    this.port = process.env.HTTP_PORT;
  }
  listen() {
    this.index.listen(this.port, () => {
      console.log("listening on port", this.port);
    });
  } 

}


module.exports = Server;
