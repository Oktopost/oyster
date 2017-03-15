var jsdom = require('jsdom').jsdom;


var doc = jsdom('<!doctype html><html><body></body></html>');
var win = doc.defaultView;


global.window 			= win;
global.document 		= doc;
global.plankton 		= require('oktopost-plankton');
global.plankton.text 	= require('plankton-text');