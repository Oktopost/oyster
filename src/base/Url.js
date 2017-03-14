(function () {
	'use strict';


	var Url = function (url) {

		this.parse = function () {
			var parser = document.createElement('a');
			parser.href = url;

			return parser;
		};

	};


	Oyster.register('Url', Url);

})();