namespace('Oyster.Modules.Utils', function (root)
{
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	var Module				= root.Oyster.Module;
	var ModuleController	= root.Oyster.Modules.Utils.ModuleController;
	

	/**
	 * @name {Oyster.Modules.Utils.ModuleBuilder}
	 * @alias {ModuleBuilder}
	 */
	var ModuleBuilder = {

		/**
		 * @param {*} a
		 * @param {*=} b
		 * @returns {string}
		 * @private
		 */
		_extractName: function (a, b)
		{
			if (is.string(a))
			{
				return a;
			}
			
			if (is(a['moduleName']))
			{
				var name;
				
				if (is.string(a['moduleName']))
				{
					name = a['moduleName'];
				}
				else if (is.function(a['moduleName']))
				{
					name = a['moduleName']();
				}
				
				if (is.string(name))
				{
					return name;
				}
			}
			
			if (is(b))
			{
				try 
				{
					return ModuleBuilder._extractName(b);
				}
				catch (e)
				{
					throw new Error('Could not determine name for module ' + a + ' with definition ' + b);
				}
			}
			
			throw new Error('Could not determine name for module ' + a);
		},
		
		/**
		 * @param manager
		 * @param {string|Module|function|{}|[]} main
		 * @param {string|Module|function=} extra
		 * 
		 * @returns {Module|[]}
		 */
		get: function (manager, main, extra)
		{
			var module = null;
			var name;
			
			if (is.array(main))
			{
				module = [];
				
				foreach(main, function (item) 
				{
					module = module.concat(ModuleBuilder.get(manager, item));
				});
			}
			else if (is.string(main))
			{
				if (is.function(extra))
				{
					module = new extra();
				}
				else if (extra instanceof Module)
				{
					module = extra;
				}
				else
				{
					throw new Error('Unexpected type passed');
				}
				
				module.setController(new ModuleController(manager, main));
			}
			else if (is.function(main))
			{
				module = new main();
				
				name = ModuleBuilder._extractName(module, main);
				module.setController(new ModuleController(manager, name));
			}
			else if (main instanceof Module)
			{
				module = main;
				
				name = ModuleBuilder._extractName(module);
				module.setController(new ModuleController(manager, name));
			}
			else if (is.object(main))
			{
				module = [];
				
				foreach.pair(main, function (name, item) 
				{
					module.push(ModuleBuilder.get(manager, name, item));
				});
			}
			
			if (!is(module))
			{
				throw new Error('Unexpected type passed');
			}
			
			return module;
		}
	};
	
	
	this.ModuleBuilder = ModuleBuilder;
});