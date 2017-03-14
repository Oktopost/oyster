(function () {
	'use strict';


	var View = function (dirname) {
		this.get = function (template, options) {
			return Handlebars.templates[dirname][template].hbs(options);
		};
	};


	Oyster.register('View', View);

})();