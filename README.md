# Oyster JS

Lightweight framework for building single page applications.


## Features

1. Namespace
2. Routing
3. Model
4. Views

## Installation

Download or clone the repository to your development environment and install the dependencies using:

```
npm install
bower install
```

## Build

The default build destination is the */build* folder. Use *gulp build* to build the application or *gulp watch* to build the application when changes are made. 


## Usage


### Namespaces

Namespaces are set using the Oyster object, like so:

``` javascript
Oyster.register('my.Model', Model);
```

Will register as:

```
window.Oyster.my.Model
```

To call an instance, use:

``` javascript
Oyster.instance('my.Model');
```

Or:

``` javascript
Oyster.instance('my.Model', options);
```

### Routing

Oyster uses *History.js* to detect changes in the state of the window, like so:

``` javascript
window.History.Adapter.bind(window, 'statechange', function () {});
```

And the Route object is responsible for parsing the requested URL to your application controllers.

``` javascript
Oyster.instance('Route').getRoute('/my/home'); // MyHomeController
```

The default parser inside the Route object can be overridden for different routing preferences, like so:

``` javascript
Oyster.instance('Route').setParser(function (url) {
	return 'MyController';
});
```

### Model
The Oyster model is a simple wrapper for jQuery.Ajax, it has 2 public methods for *GET* and *POST* requests and can be used like so:

``` javascript
var MyModel = Oyster.instance('Model', {
    onDone: myDoneFunction,
	onFail: myFailFunction,
	onComplete: myCompleteFunction,
	onSend: myBeforeSendFunction
});

var jqXHR = MyModel.get('/my/url');
```

Or

``` javascript
var MyModel = Oyster.instance('Model');

MyModel.get('/my/url').done(function (json) {
	console.log('Hello World');
});
```

### Views
Oyster uses Handlebars.js for templating. All templates are precompiled using gulp. Views can be loaded using:

``` javascript
Oyster.instance('View', dirname).get(template, { /* data */ });
```
For example, the following command:
``` javascript
Oyster.instance('View', 'index').get('home', {});
```
Will load:
```
app/views/index/home.hbs.html
```