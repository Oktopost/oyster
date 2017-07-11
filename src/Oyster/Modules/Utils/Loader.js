namespace('Oyster.Modules.Utils', function (root)
{
	var classify	= root.Classy.classify;
	
	var is			= root.Plankton.is;	
	var obj			= root.Plankton.obj;
	var func		= root.Plankton.func;
	var array		= root.Plankton.array;
	var foreach		= root.Plankton.foreach;
	
	var LoadSequence = Oyster.Modules.Utils.LoadSequence;


	/**
	 * @name Oyster.Modules.Utils.Loader
	 * @alias Loader
	 * 
	 * @param {callback} onLoad
	 * @param {callback} onUnload
	 * 
	 * @constructor
	 */
	function Loader(onLoad, onUnload)
	{
		classify(this);
		
		this._pendingLoad		= [];
		this._pendingUnload		= [];
		
		this._seq		= new LoadSequence(onLoad, onUnload);
		this._isRunning	= false;
	}
	
	
	Loader.prototype._loop = function ()
	{
		var toLoad		= this._pendingLoad.pop();
		var toUnload	= this._pendingUnload.pop();
		
		if (is(toLoad) || is(toUnload))
		{
			this._seq.execute(obj.values(toLoad), obj.values(toUnload));
		}
		
		this._postLoop();
	};
	
	Loader.prototype._postLoop = function ()
	{
		this._isRunning = false;
		this._schedule();
	};
	
	Loader.prototype._schedule = function ()
	{
		if (this._isRunning)
			return;
		
		if (this._pendingLoad.length === 0 && this._pendingLoad.length === 0)
			return;
		
		this._isRunning = true;
		func.do(func.safe(this._loop, function (error) { console.error('Error in load loop', error); }));
	};
	
	Loader.prototype._unfoldArray = function (target, arr)
	{
		foreach(arr, 
			function (item) 
			{
				this._pendingLoad.push({});
				this._pendingUnload.push({});
				
				this._append(target, item);
			}, 
			this);
	};

	/**
	 * @param {[]} target
	 * @param {Module[]} modules
	 * @private
	 */
	Loader.prototype._append = function (target, modules)
	{
		if (is.array(target))
		{
			this._unfoldArray(target, modules);
			return;
		}
		
		var container		= array.last(target);
		var toLoadContainer	= array.last(this._pendingLoad);
		
		foreach(modules,
			/**
			 * @param {Module} module
			 */
			function (module)
			{
				var name = module.manager().name();
				
				if (is(toLoadContainer[name]))
				{
					throw new Error('Module named ' + name + ' is already scheduled for load');
				}
				
				container[name] = module;
			});
	};


	/**
	 * @param {Module|Module[]} module
	 */
	Loader.prototype.load = function (module)
	{
		foreach(array(module), function (item) { this._append(this._pendingLoad, item); }, this);
		
		this._pendingLoad.push({});
		this._pendingUnload.push({});
	};

	/**
	 * @param {Module|Module[]} module
	 */
	Loader.prototype.unload = function (module)
	{
		foreach(array(module), function (item) { this._append(this._pendingUnload, item); }, this);
		
		this._pendingLoad.push({});
		this._pendingUnload.push({});
	};
	
	
	this.Loader = Loader;
});