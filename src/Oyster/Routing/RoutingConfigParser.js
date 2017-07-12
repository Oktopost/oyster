namespace('Oyster.Routing', function (root)
{
	var is			= root.Plankton.is;
	var foreach		= root.Plankton.foreach;
	
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	var ParsingCursor	= root.Oyster.Routing.ParsingCursor;
	
	
	/**
	 * @name {Oyster.Routing.RoutingConfigParser}
	 * @alias {RoutingConfigParser}
	 */
	var RoutingConfigParser = {
		
		/**
		 * @param {Oyster.Routing.ParsingCursor} cursor
		 * @param {*} config
		 * @param {*} object
		 * @return {boolean}
		 * @private
		 */
		_tryExtractRoute: function (cursor, config, object)
		{
			if (is(config['$']) && is.function(config['$'].action))
			{
				object['$'] = cursor.parseRouteConfig(config['$']);
				delete config['$'];
				return true;
			}
			else if (is(config['route']) && is.function(config['route'].action))
			{
				object['$'] = cursor.parseRouteConfig(config['route']);
				delete config['route'];
				return true;
			}
			
			return false;
		},
		
		/**
		 * @param {ParsingCursor} cursor
		 * @param {*} config
		 * @param {*} object
		 * @private
		 */
		_parse: function (cursor, config, object)
		{
			var pop = RoutingConfigParser._tryExtractRoute(cursor, config, object);
			
			foreach.pair (config, function (name, value) 
			{
				object[name] = {};
				RoutingConfigParser._parse(cursor, value, object[name]);
			});
			
			if (pop) cursor.pop();
		},
		
		
		/**
		 * @param {*} manager
		 * @param {*} config
		 * @param {RoutesBuilder} builder
		 */
		parse: function (manager, config, builder)
		{
			var object	= {};
			var cursor	= new ParsingCursor(manager, builder);
			
			RoutingConfigParser._parse(cursor, config, object);
			
			return object;
		}
	};
	
	
	this.RoutingConfigParser = RoutingConfigParser;
});