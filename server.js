const express = require("express");
const session =  require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = 1895;

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, './angularCS/dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use(session({secret: "asfasfsf@$#r$##4rgsoigm9fn408"}));

// require('./server/config/mongoose');
require('./server/config/routes')(app);

app.get('/', (request, resp)=> {
    resp.render('index');

})

app.listen(PORT, ()=> {
  console.log(`Listening on port: ${PORT}`)
})
