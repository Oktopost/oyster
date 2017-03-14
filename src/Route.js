(function () {
	'use strict';


	var Route = function () {
		var parser = Oyster.instance('parsers.Route');
		

		var getRoute = function () {
			return parser.parse(window.History.getState().url);
		};


		this.setParser = function (parser) {
			parser = parser;
		};

		this.bindState = function (callback) {			
			window.History.Adapter.bind(window, 'statechange', function () {
				Oyster.instance('Dispatch').stateChange(getRoute());
			});
		};

		this.pushState = function (url, title, data) {
			data = data || {};
			data['rand'] = Math.random();

			window.History.pushState(data, title, url);
		};
	};


	Oyster.register('Route', Route);

})();