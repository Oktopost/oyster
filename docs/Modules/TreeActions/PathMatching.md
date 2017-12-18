#### Table of Contents

  * [Path Matching](#path-matching)
  * [Routing Config](#routing-config)
  * [Running the Example](#running-the-example)
  * [References](#references)
  

### Path Matching

In this example, to different urls are mapped to 2 different actions.

1. `/path_match` is mapped to `Example.PathMatch.MainAction`
2. `/different/path` is mapped to `Example.PathMatch.SecondAction`


### Routing Config

The configuration for this example is as follows: 

```js
namespace('Example.PathMatch', function (window)
{
	var MainAction		= window.Example.PathMatch.MainAction;
	var SecondAction	= window.Example.PathMatch.SecondAction;
	
	
	this.PathMatchRoutes = {
		Main:
		{
			$:
			{
				path: '/path_match',
				action: MainAction
			}
		},
		Second:
		{
			$:
			{
				path: '/different/path',
				action: SecondAction
			}
		}
	};
});
```
> The keys `Main` and `Second` do not play any role, for the sake of this example, and can be replaced with any other value.

In this example, the top level configuration object consists of 2 objects: `Main` and `Second`. Each of those objects 
contains one config. 

* `Main` contains the config for route `/path_mathc`
* `Second` contains the config for the route `/different/path`

Both of the actions are setup identically to the previous [Intro](Intro.md) example, the only 
difference being there name and log message.


### Running the Example

1. In terminal navigate to the docs directory.
2. Navigate to Modules/TreeRouting/Examples
3. Run `npm start`, this will install dependencies, compile resources and start an express server.
  Express Server can be stopped by pressing `Ctrl + C`
4. Open the browser and developer tools.
5. Navigate to [http://127.0.0.1:3800/path_match](http://127.0.0.1:3800/path_match)

Now in the developer tools' console you should see the following output:

```
IntroAction initializing
IntroAction activating
IntroAction executing
```

6. Click on the `Different Path` link. This will update the URL to `/different/path`, without refreshing the page.

The next lines should be know visible in the console:
 
```
Navigating to: /different/path
MainAction will be destroyed
SecondAction initializing
SecondAction activating
SecondAction executing
MainAction was destroyed
```

> Navigating to: /different/path line is made by the example's Navigation module. See `Example.Modules.HistoryJsNavigationModule.navigate`


#### References

[Action Loading Sequence](ActionLoadSequence.md)