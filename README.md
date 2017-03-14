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

To initialize routing, use the Oyster Route object, like so:

``` javascript
Oyster.instance('Route').bindState();
```

This will bind the window state and will dispatch a call to correct controller on every state change. To push a new state, use:

``` javascript
Oyster.instance('Route').pushState(url, title, data);
```

Routes are automatically initialized in *Boot.js* but can be overridden.

#### Example
The following command:
``` javascript
Oyster.instance('Route').pushState('/my/home', 'Home');
```
Will route to:
```
app/controllers/MyHomeController.js // this.render
```
And this command:
``` javascript
Oyster.instance('Route').pushState('/', 'Home');
```
Will route to:
```
app/controllers/IndexController.js // this.render
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

### Views
Oyster uses Handlebars.js for templating and all templates are precompiled using gulp. Views can be loaded using:

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