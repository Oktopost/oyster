# Actions Chain update sequence

## Table Of Contents

  * [Pre Condition](#pre-condition)
  * [Update Sequence](#update-sequence)
    * [Actions constructor](#actions-constructor)
    * [preDestroy(newParams, prevParams)](#preDestroynewParams-prevParams)
    * [Setup](#Setup)
    * [initialize(newParams, prevParams)](#initializenewParams-prevParams)
    * [refresh(newParams, prevParams)](#refreshnewParams-prevParams)
    * [update(newParams, prevParams)](#updatenewParams-prevParams)
    * [activate(newParams, prevParams)](#activatenewParams-prevParams)
    * [execute(newParams, prevParams) ](#executenewParams-prevParams)
    * [destroy(newParams, prevParams)](#destroynewParams-prevParams)
  * [Initial Load](#initial-load)
  * [Notes](#notes)

## Pre Condition

For this example we will assume the following routes configuration:

```text
Action A 
	path a
	params
		prm1

	Action B
		path b
		params
			prm2
	
		Virtual Action C'
		
			Action D 
				path d
			
		
		Action N
			path n
```

The users initial location is *https://...domain.../a/b/__d__?prm1=1&prm2=__2__* and according to the configuration, 
the currently loaded **Actions Chain** is: **A** -> **B** -> **C'** -> **D**

The user than navigates to *https://...domain.../a/b/__n__?prm1=1&prm2=__3__*, new **Actions Chain** corresponding 
to this route is **A** -> **B** -> **N**

In this scenario, the next list of steps must be executed during the **Actions Chain** update:

1. Actions **C'** and **D** must be unmounted because they no longer exist in the new target chain.
2. Action **N** must be mounted.
3. Action **B** must be updated, because the parameter of this action, **prm2**, was modified.
4. Action **A** was not modified.

## Update Sequence

The update sequence on route change is executed as follows:

1. **preDestroy** on actions to be unmount.
2. **initialize** on actions to be mounted.
3. The chain state is updated to match the new target chain.
4. **refresh** on all unmodified actions.
5. **update** and **execute** on all still mounted actions which parameters had been changed.
6. **activate** and **execute** on all newly mounted actions.
7. Asynchronous call to **destroy** on all unmounted actions.

Note that each step is performed on parents first. For example the **preDestroy** method is called
first on **C'** and then **D**.

### Actions constructor

Unmounted actions are never reused. When a new action is mounted, it will always be a newly created instances.
However, there is no promise to when the new action is actually constructed, therefore
you must never use the constructor of the action for it's initialization. For this purpose, 
the **Action.initialize** method exists.

### preDestroy(newParams, prevParams)

> Target Actions: **C'** and **D**

This **preDestroy** method is invoked on all the actions that should be unmount and are no longer present in 
the new **Actions chain**.

### Setup

At this stage, the **Actions Chain** is updated:  **A** -> **B** -> **C'** -> **D** becomes **A** -> **B** -> **N**.

Params, app, child and parent properties of each action are also updated during this stage. 

### initialize(newParams, prevParams)

> Target Action: **N**

The **initialize** method is invoked on all new mounted actions.
  
### refresh(newParams, prevParams)

> Target Action: **A**

The refresh action is invoked all on Actions that have not changed.
 
### update(newParams, prevParams)

> Target Action: **B**

The **update** method is invoked on all actions which mounted state did not change, but action's parameters did.
Note that the **execute** method is also invoked for same actions at this point.

### activate(newParams, prevParams)

> Target Action: **N**

The **activate** action is invoked only for the newly mounted actions, therefore it is never invoked more then once 
per instance. Note that the **execute** method is also invoked for same actions at this point.

### execute(newParams, prevParams) 

> Target Actions: **B** and **N**

The **execute** method is called on any action which parameters were modified or it was just mounted. It is always 
called right after **update** or **active** on the same action.
So if the updated/mounted actions are **B** -> **N** the call sequence will be:

1. **B.update(...)**
2. **B.execute(...)**
3. **N.activate(...)**
4. **N.execute(...)**

This method should be used when same operation must be executed both during the **update** and **activate** stages.

### destroy(newParams, prevParams)

> Target: **C'**, **D**

The **destroy** method is called asynchronously on all unmounted modules. This is the only method to be invoked 
asynchronously in the update sequence. 
The **destroy** method invoked on all actions at once and not asynchronously per action.


## Initial Load

There is no real difference between first time load and any following load. On the first load, the initial **Actions Chain** 
is treated as an empty array - as if there is no Actions to unmount, update or refresh. 

## Notes

- During **preDestroy** call, the state of the chain is still not updated, and *Action.params()* method will return
previous route's parameters instead of the new once.
- Unlike Modules, Actions' update methods may not be defined. The parent **Oyster.Action** class does not have 
the **preDestroy**, **initialize**, **refresh**, **update**, **activate**, **execute** or **destroy** methods in
it's prototype.
- All methods in the Update sequence, excluding **destroy**, are invoked synchronously one after another.
- Exceptions will not break the loading sequence.