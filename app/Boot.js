(function () {
	'use strict';


	var Boot = function () {
		var route = Oyster.instance('Route');
		var link = Oyster.instance('Link');


		var onClick = function (elem) {
			route.pushState(elem.attr('href'), elem.attr('title'));
		};

		var bindEvents = function () {
			route.bindState();
			link.bindClicks(onClick);
		};

		var init = function () {
			bindEvents();
			route.pushState(window.location.pathname, '');
		};

		init();
	};


	var app = new Boot();

})();