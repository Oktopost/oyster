(function () {
	'use strict';


	var Route = function () {
		
		this.bindState = function (callback) {			
			window.History.Adapter.bind(window, 'statechange', function () {
				Oyster.instance('Dispatch').stateChange(window.History.getState());
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