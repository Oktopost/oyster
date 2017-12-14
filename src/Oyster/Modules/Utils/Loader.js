namespace('Oyster.Modules.Utils', function (root)
{
	var classify	= root.Classy.classify;
	
	var is			= root.Plankton.is;	
	var obj			= root.Plankton.obj;
	var func		= root.Plankton.func;
	var array		= root.Plankton.array;
	var foreach		= root.Plankton.foreach;
	
	var LoadSequence = root.Oyster.Modules.Utils.LoadSequence;


	/**
	 * @name {Oyster.Modules.Utils.Loader}
	 * @alias {Loader}
	 * 
	 * @param {callback} onLoad
	 * @param {callback} onUnload
	 * @param {callback=} onComplete
	 * 
	 * @constructor
	 */
	function Loader(onLoad, onUnload, onComplete)
	{
		classify(this);
		
		this._pendingLoad		= [];
		this._pendingUnload		= [];
		this._onComplete		= onComplete || function() {};
		
		this._seq		= new LoadSequence(onLoad, onUnload);
		this._isRunning	= false;
	}
	
	
	Loader.prototype._loop = function ()
	{
		var toLoad		= this._pendingLoad.shift();
		var toUnload	= this._pendingUnload.shift();
		
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
		
		if (!this._isRunning)
			this._onComplete();
	};
	
	Loader.prototype._schedule = function ()
	{
		if (this._isRunning)
			return;
		
		if (this._pendingLoad.length === 0 && this._pendingUnload.length === 0)
			return;
		
		this._isRunning = true;
		func.async.do(func.safe(this._loop, function (error) { console.error('Error in load loop', error); }));
	};
	
	/**
	 * @param {[]} target
	 * @param {Module[]|Module} module
	 * @private
	 */
	Loader.prototype._append = function (target, module)
	{
		if (is.array(module))
		{
			(target === this._pendingLoad ? this.load(module) : this.unload(module));
			return;
		}
		
		var container		= array.last(target);
		var toLoadContainer	= array.last(this._pendingLoad);
		
		var name = module.control().name();
			
		if (is(toLoadContainer[name]))
		{
			throw new Error('Module named ' + name + ' is already scheduled for load');
		}
		
		container[name] = module;
	};


	/**
	 * @param {Module|Module[]} module
	 */
	Loader.prototype.load = function (module)
	{
		this._pendingLoad.push({});
		this._pendingUnload.push({});
		
		foreach(array(module), this, function (item) { this._append(this._pendingLoad, item); });
		
		this._schedule();
	};

	/**
	 * @param {Module|Module[]} module
	 */
	Loader.prototype.unload = function (module)
	{
		this._pendingLoad.push({});
		this._pendingUnload.push({});
		
		foreach(array(module), this, function (item) { this._append(this._pendingUnload, item); });
		
		this._schedule();
	};
	
	/**
	 * @return {boolean}
	 */
	Loader.prototype.isLoading = function ()
	{
		return this._isRunning;
	};
	
	
	this.Loader = Loader;
});