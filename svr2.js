// import express module...
var express = require('express');
var bodyParser = require('body-parser');
//links external files somehow..
var path = require('path');
var session = require('express-session');
// initiate express node js app
var app = express();

//setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(session({secret: 'faefni4389439hr4984#$%#$^i5h5uh45ot54'}));
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, './static')));


app.get('/', function (request, response) {


    response.render('index', {counter: addCount(request)});
})

app.post('/locate', (request, resp) =>)

// app.post('/add-two', function (request, response){
//     addCount(request);
//
//     return response.redirect('/');
// })
//
// app.post('/reset', function (request, response){
//     request.session.destroy();
//
//     response.redirect('/')
// })
//
// function addCount(request) {
//     if(request.session.counter == undefined){
//         return request.session.counter = 0}
//     else{
//         return request.session.counter += 1
//     }
// }

app.listen(1990, function() {
    console.log('listening on port 1990');
});
