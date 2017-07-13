namespace('Oyster.Modules', function (root)
{
	var Enum = root.Classy.Enum;
	

	/**
	 * @name {Oyster.Modules.OysterModules}
	 * @enum {string}
	 */
	OysterModules = {
		NavigationModule: 'Oyster.NavigationModule'
	};
	
	
	this.OysterModules = Enum(OysterModules);
});