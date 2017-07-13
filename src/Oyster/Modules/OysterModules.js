namespace('Oyster.Modules', function (root)
{
	var Enum = root.Classy.Enum;
	

	/**
	 * @name {Oyster.Modules.OysterModules}
	 * @alias OysterModules
	 */
	var OysterModules = {
		NavigationModule: 	'Oyster.NavigationModule',
		RoutingModule:		'Oyster.RoutingModule'
	};
	
	
	this.OysterModules = Enum(OysterModules);
});