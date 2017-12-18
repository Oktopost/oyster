#### Table of Contents

  * [Intro](#intro)
  * [Example](#example)
    * [Routing Config](#routing-config)
    * [Simple Action Setup](#simple-action-setup)
    * [Application Setup](#application-setup)
    * [Application Setup](#application-setup)
  * [Running the Example](#running-the-example)
  * [References](#references)
  

### Intro

TreeAction module is a module build to handle URLs in single page application. 
In this module a url is mapped to an array of actions, defined by a routing config.
When the user navigates to any url, this module will search for the array of actions 
matching this URL and activate them. 

A BaseNavigationModule MUST be set when using this module. TreeAction is responsible 
for handling urls and not for the navigation itself. A different module must trigger
this module on URL changes and handle any links or redirect.

Navigation to a URL that is not defined in the Routing config will invoke the handleMiss 
method inside BaseNavigationModule. It's suggested to redirect to a known url (for example 
`.../not-found`) is such cases.


### Example

In the routing config, a url can be mapped to an action. In this example, the URL `.../intro` 
is mapped to the `Example.Intro.IntroAction` Action.


#### Routing Config

The configuration for such setup is:

```js
namespace('Example.Intro', function (window)
{
	var IntroAction = window.Example.Intro.IntroAction;
	
	
	this.IntroRoutes = {
		$:
		{
			path: '/intro',
			action: IntroAction
		}
	};
});
```

TreeRoute action will search recursively in the object passed to it as the configuration. Each 
time a `$` key is met, the value of this key will be parsed as a route configuration.

In the example above, a route configurations is:

```js
{
	path: '/intro',
	action: IntroAction
}
```

Here, the url `/intro` is mapped to the action `IntroAction` which is an alias to `Example.Intro.IntroAction`.

Also in this case the a url is mapped only to one actions. 


#### Simple Action Setup 

Each action should inherit the `Oyster.Action` class. Here is the example for `IntroAction` action:

```js
namespace('Example.Intro', function (window)
{
	var Action = window.Oyster.Action;
	
	var inherit		= window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	
	function IntroAction()
	{
		Action.call(this);
		classify(this);
	}
	
	
	inherit(IntroAction, Action);
	
	
	IntroAction.prototype.initialize = function ()
	{
		console.log('IntroAction initializing');
	};
	
	IntroAction.prototype.activate = function ()
	{
		console.log('IntroAction activating');
	};
	
	IntroAction.prototype.execute = function ()
	{
		console.log('IntroAction executing');
	};
	
	
	this.IntroAction = IntroAction;
});
```

> *NOTE*: An Action does not need to implemented any methods. 
> The implementations above are done only for the sake of this example. 


#### Application Setup

Finally the application setup looks like follows.

```js
namespace('Example', function (window)
{
	var TreeActionsModule			= window.Oyster.Modules.Routing.TreeActionsModule;
	var HistoryJsNavigationModule	= window.Example.Modules.HistoryJsNavigationModule;
	
	var Application = window.Oyster.Application;
	var IntroRoutes = window.Example.Intro.IntroRoutes;
	
	
	this.IntroExample = function ()
	{
		Application.create(
			[
				HistoryJsNavigationModule,
				TreeActionsModule
			], 
			function setupApplication(app, routing)
			{
				routing.setupRoutes(IntroRoutes);
				app.run();
			});
	};
});
```

1. `HistoryJsNavigationModule` and `TreeActionsModule` are configured as the applications modules.
2. The `IntroRoutes` setup is passed to the routing parameter inside the `setupApplication` functions.
3. The method `IntroExample` must be invoked for the applications to start. For example:
	```html
	<script src="app.js"></script>
	<script>
		Example.IntroExample();
	</script>	
	```


### Running the Example

1. In terminal navigate to the docs directory.
2. Navigate to Modules/TreeRouting/Examples
3. Run `npm start`, this will install dependencies, compile resources and start an express server.
  Express Server can be stopped by pressing `Ctrl + C`
4. Open the browser and developer tools.
5. Navigate to [http://127.0.0.1:3800/intro](http://127.0.0.1:3800/intro)

Now in the developer tools' console you should see the following output:

```
IntroAction initializing
IntroAction activating
IntroAction executing
```


#### References

[Action Loading Sequence](ActionLoadSequence.md)


[Next: Path Matching ->](PathMatching.md)