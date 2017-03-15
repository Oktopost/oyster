(function () {
	'use strict';


	var State = function () {
		
		this.getUrl = function () {
			return window.History.getState().url;
		};
		
		this.push = function (url, title, data) {
			data = data || {};
			data['rand'] = Math.random();

			window.History.pushState(data, title, url);
		};

	};


	window.Oyster.register('State', State);

})();