(function () {
	'use strict';


	var is = plankton.is;
	var text = plankton.text;


	var Route = function () {
		var routeParser;
		

		var getName = function (str) {
			if (str.length === 0) {
				return '';
			}

			var parts = str.split('-');
			var name = '';
			var part;

			for (part in parts) {
				name = name + text.capitalize(parts[part]);
			}

			return name;
		};


		this.setParser = function (parser) {
			if (is.function(parser)) {
				routeParser = parser;
			}
		};

		this.getRoute = function (url) {
			if (is.function(routeParser)) {
				return routeParser(url);
			}

			var parts = url.substring(1).split('/');
			var part1 = parts[0].length ? parts[0] : 'index';
			var part2 = is.undefined(parts[1]) ? '' : parts[1];

			return getName(part1) + getName(part2) + 'Controller';
		};
	};


	window.Oyster.register('Route', Route);

})();