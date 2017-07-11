namespace('Oyster', function (root)
{
	var classify 	= root.Classy.classify;
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	
	var Loader			= root.Oyster.Modules.Utils.Loader;
	var ModuleBuilder	= root.Oyster.Modules.Utils.ModuleBuilder;
	

	/**
	 * @class Oyster.ModuleManager
	 * @alias Manager
	 * 
	 * @property {*} _modules
	 * @property {Loader} _loader
	 * 
	 * @constructor
	 */
	function ModuleManager()
	{
		classify(this);
		
		this._modules = {};
		this._loader = new Loader(this._register, this._deRegister);
	}


	/**
	 * @param {Module} module
	 * @private
	 */
	Manager.prototype._register = function (module)
	{
		var name = module.module().name();
		
		if (is(this._modules[name]))
			throw new Error('Module with the name ' + name + ' is already registered!');
		
		this._modules[name] = module;
	};
	
	/**
	 * @param {Module} module
	 * @private
	 */
	Manager.prototype._deRegister = function (module)
	{
		var name = module.module().name();
		
		if (!is(this._modules[name]))
			throw new Error('Module with the name ' + name + ' is not registered!');
		
		delete this._modules[name];
	};
	
	
	/**
	 * @param {Module} module
	 * @returns {Manager}
	 */
	Manager.prototype.remove = function (module)
	{
		this._loader.unload(module);
		return this;
	};

	/**
	 * @param {string|Module|function|{}|[]} target
	 * @param {string|Module|function=} extra
	 * @returns {Manager}
	 */
	Manager.prototype.add = function (target, extra)
	{
		target = ModuleBuilder.get(this, target, extra);
		target = array(target);
		
		// Make sure each call to add treated as a separate load group.
		if (!is.array(array.first(target)))
		{
			target = [target];
		}
		
		this._loader.load(target);
		return this;
	};

	/**
	 * @param {string} name
	 * @returns {Module|null}
	 */
	Manager.prototype.get = function (name) 
	{
		return this._modules[name] || null;
	};

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	Manager.prototype.has = function (name) 
	{
		return is(this._modules[name]);
	};
	
	
	this.Manager = Manager;
});