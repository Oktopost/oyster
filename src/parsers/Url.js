(function () {
	'use strict';


	var Url = function () {

		this.parse = function (url) {
			var parser = document.createElement('a');
			parser.href = url;

			return parser;
		};
		
	};


	Oyster.register('parsers.Url', Url);

})();