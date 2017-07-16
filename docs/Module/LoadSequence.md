# Modules Mount/Unmount Sequence

## In short 

* **L** - modules to mount.
* **U** - modules to unmount.

Next operations are applied for each instance of **L** or **U** modules in the order specified below:

1. **L**.**initialize**()
2. **U**.**preUnload**() 
3. **U** modules are unmounted by the module manager.
4. **U**.**postUnload**()
5. **U**.**onUnload**()
6. **L** modules are mounted by the module manager mounted
7. **L**.**preLoad**()
8. **L**.**onLoad**()
9. **L**.**postLoad**()
10. Async **U**.**destroy**()

## Pre condition

Assuming the state of the module manger as follows:
Mounted modules: **M1**, **M2**, **U1**, **U2**
[](InitialState.png)

Modules to mount: **L1**, **L2**
[](ToMount.png)

Modules to unmount: **U1**, **U2**
[](ToUnmount.png)

## 1. Invoke (**L1**, **L2**).initialize()

The initialize method invoked on all the modules targeted to be mounted. 
Note that at this point the **isLoaded** flag of those modules is still **false**. 

```js
l1.initialize();
l2.initialize();
```

## 2. Invoke (**U1**, **U2**).preUnload()

preUnload method is invoked on all modules targeted for unmount.
The **isLoaded** flag is still **true** for those modules.

```js
U1.preUnload();
u2.preUnload();
```

## 3. Invoke (**U1**, **U2**).onUnload()

At this point the **isLoaded** flag is updated to **false** and the onUnload method 
invoked right after.

```js
U1.onUnload();
u2.onUnload();
```

## 4. Unmount **U1**, **U2**

All the modules targeted for unmount are removed from the module manager.
Module manager's new state is: **M1**, **M2**
[](MiddleState.png)

## 5. Invoke (**U1**, **U2**).postUnload()

postUnload method invoked on the unmount modules.

```js
u1.postUnload();
u2.postUnload();
```

## 6. Mount **L1** and **L2**

All modules targeted for mount are mounted by the module manager.
New module manager's state is: **M1**, **M2**, **L1**, **L2**
[](FinalState.png)

## 7. Invoke (**L1**, **L2**).preLoad

The preLoad method is invoked on all newly mounted modules. Note that the 
**isLoaded** flag is still **false**.

```js
l1.preLoad();
l2.preLoad();
```

## 8. Invoke (**L1**, **L2**).onLoad()

At this point the **isLoaded** flag is updated to **true** and the onLoad method 
invoked right after.

```js
l1.onLoad();
l2.onLoad();
```

## 9. Invoke (**L1**, **L2**).postLoad()

The postLoad methods invoked on all mounted modules.

```js
l1.postLoad();
l2.postLoad();
```

## 10. Async Invoke  (**U1**, **U2**).destroy()

The destroy method is invoked on all unmount modules.

```js
u1.destroy();
u2.destroy();
```