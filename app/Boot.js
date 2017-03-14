(function () {
	'use strict';


	var Boot = function () {
		var route = Oyster.instance('Route');


		var onClick = function (elem) {
			route.pushState(elem.attr('href'), elem.attr('title'));
		};

		var bindEvents = function () {
			route.bindState();

			$(document).on('click', 'a[data-o-link]', function (e) {
				e.preventDefault();
				onClick($(this));
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