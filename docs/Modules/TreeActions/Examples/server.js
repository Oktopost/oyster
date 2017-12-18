const express = require('express');


var app = express();


app.use(express.static('bin'));


app.get('/intro', function (req, res)
{
	res.sendFile(__dirname + '/Intro/intro.html');
});

app.get('/path_match', function (req, res)
{
	res.sendFile(__dirname + '/PathMatching/PathMatching.html');
});

app.get('/different/path', function (req, res)
{
	res.sendFile(__dirname + '/PathMatching/PathMatching.html');
});


app.listen(3800, function () 
{
	console.log('Example app listening on port 3800!')
});