#### Table of Contents

  * [Action Chain](#action-chain)
  * [Routing Config](#routing-config)
  * [Running the Example](#running-the-example)
  * [References](#references)
  

### Action Chain

An array of actions mapped to a specific URL path named **Action Chain**.

Each time a new URL is parsed, currently mounted chain will be replaced by the new target chain. 
However, if number of actions at the start of the mounted chain are the same as in the new 
target chain, this actions will remain mounted. The process of switching chains is refereed to as **Action Chain Update**.

In this example such process is demonstrated.


### Routing Config

```js
namespace('Example.ChainSetup', function (window)
{
	var MainAction		= window.Example.ChainSetup.MainAction;
	var FirstAction		= window.Example.ChainSetup.FirstAction;
	var SecondAction	= window.Example.ChainSetup.SecondAction;
	
	
	this.ChainSetupRoutes = {
		$:
		{
			path: 'chain',
			action: MainAction
		},
		FirstChild:
		{
			$:
			{
				path: 'first',
				action: FirstAction
			},
			SecondChild:
			{
				$:
				{
					path: 'second',
					action: SecondAction
				}
			}	
		}
	};
});
```
> The keys of the child objects do not play any role for this example and can be replaced with any other value without affection the behivor.


When parsing the configuration, any object under the `$` key, is treated as part of the chain config.
All objects on the same level as the `$` key, are considered child configurations of the `$`'s configuration. 

Child configuration's path is combined with the parent path. The resulting path, it the path which will match this
`Parent Action -> Child Action` chain. 

In the example above, `FirstChild` is the child of the `MainAction`. While `SecondChild` is the child for the 
`FirstChild` config:

* URL `/chain` will match the chain `MainAction` 
* URL `/chain/first` will match the chain `MainAction -> FirstAction`
* URL `/chain/first/second` will match the chain `MainAction -> FirstAction -> SecondAction`


### Running the Example

1. In terminal navigate to the docs directory.
2. Navigate to Modules/TreeRouting/Examples
3. Run `npm start`, this will install dependencies, compile resources and start an express server.
Express Server can be stopped by pressing `Ctrl + C`
4. Open the browser and developer tools.
5. Navigate to [http://127.0.0.1:3800/chain](http://127.0.0.1:3800/path_match)

Now in the developer tools' console you should see the following output:

```
MainAction initializing
MainAction activating
MainAction executing
```

6. Click on the `First Child` link. This will update the URL to `/chain/first

Now you should see this new lines in your console:
 
```
Navigating to: /chain/first
FirstAction initializing
MainAction refreshed
FirstAction activating
FirstAction executing
```

Note that `MainAction` is identical in both chains `MainAction` and `MainAction -> FirstAction`, therefore 
this action is not remounted, instead the `refresh` method is invoked.

7. Navigate to the last URL by clicking on the `Second Child` link.

This time the console will show:

```
Navigating to: /chain/first/second
SecondAction initializing
MainAction refreshed
FirstAction refreshed
SecondAction activating
SecondAction executing
```

8. And finally click again on `First Child`

This time the URL will change from `/chain/first/second` to `/chain/first`

This will update the chain from:

> `MainAction -> FirstAction -> SecondAction`

to

> `MainAction -> FirstAction`

Resulting in the dismount of `SecondAction` only. The console should output:

```
Navigating to: /chain/first
SecondAction will be destroyed
MainAction refreshed
FirstAction refreshed
SecondAction was destroyed
```


#### References

- [Example Files](./Examples/src/Example/ChainSetup)
- [Action Loading Sequence](ActionLoadSequence.md)


[<- Prev: Path Matching](PathMatching.md)