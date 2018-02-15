const express = require("express");
const path = require("path");

const PORT = 2750;

const app = express();

app.use(express.static(path.join(__dirname, './angularCS/dist')));


app.listen(PORT, ()=> {
  console.log(`Listening on port: ${PORT}`)
})
