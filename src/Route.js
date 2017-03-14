(function () {
	'use strict';


	var Route = function () {
		var routeParser = Oyster.instance('parsers.Route');
		

		var getRoute = function () {
			return routeParser.parse(window.History.getState().url);
		};


		this.setRouteParser = function (parser) {
			routeParser = parser;
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