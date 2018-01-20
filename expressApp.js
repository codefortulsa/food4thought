const express = require("express");
const session =  require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = 2986;
const mapAccessToken = "pk.eyJ1IjoidmljYWdiYXNpIiwiYSI6ImNqY2lpcWE2aTNteGEycWxscDl2NzhpZWQifQ.KJIJ5fZsHtxebZwwROAc5w"
const app = express();
var siteMod = require('./temp_sites');
var SITES = siteMod.SITES;

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use(session({secret: "asfasafsd3$EA$#A#39fn408"}));

// require('./server/config/mongoose');
// require('./server/config/routes')(app);

app.get('/', (request, resp)=> {

    let mapAccess = mapAccessToken;
    let listingTest = [
      {name: "Bob", desc: "this is a testy"},
      {name: "Alice", desc: "this is gonna be so freaking cool"},
      {name: "Toshi", desc: "been here since 8:45a"},
      {name: "Vic", desc: "I got the... I got the... I!"},
      {name: "Bob2", desc: "this is a testy"},
      {name: "Alice2", desc: "this is gonna be so freaking cool"},
      {name: "Toshi2", desc: "been here since 8:45a"},
      {name: "Vic2", desc: "I got the... I got the... I!"},
    ]
    console.log(SITES);
    console.log(listingTest);
    console.log(mapAccess);
    resp.render('index', { mapAccess : mapAccess, listings : listingTest, sites : SITES });

})

app.listen(PORT, ()=> {
  console.log(`Listening on port: ${PORT}`)
})
