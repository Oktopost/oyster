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

			$(document).on('click', 'a[data-o-link]', function (e) {
				e.preventDefault();
				bindClicks($(this));
			});
		};

		var init = function () {
			bindEvents();
			route.pushState(window.location.pathname, '');
		};

		init();
	};


	var app = new Boot();

})();