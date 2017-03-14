(function () {
	'use strict';


	var is = plankton.is;


	var Route = function () {
		
		var getElement = function (url) {
			return Oyster.instance('parsers.Url').parse(url);
		};

		var getParts = function (url) {
			return getElement(url).pathname.substring(1).split('/');
		};

		var getName = function (str) {
			if (str.length === 0) {
				return '';
			}

			var parts = str.split('-');
			var name = '';
			var part;

			for (part in parts) {
				name = name + parts[part].capitalize();
			}

			return name;
		};

		/**
		 * lorem-ipsum/dolor-sid => LoremIpsumDolorSidController
		 * @param  {string} url
		 * @return {string}
		 */
		this.parse = function (url) {
			var parts = getParts(url);
			var part1 = parts[0].length ? parts[0] : 'index';
			var part2 = is.undefined(parts[1]) ? '' : parts[1];			

			return getName(part1) + getName(part2) + 'Controller';
		};

	};


	Oyster.register('parsers.Route', Route);

})();