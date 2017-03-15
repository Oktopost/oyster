(function () {
	'use strict';


	var Boot = function () {
		var state = Oyster.instance('State');
		

		var onStateChange = function () {
			var controller = Oyster.instance('Route').getRoute(state.getUrl());
				
			Oyster.instance('Dispatch').stateChange(controller);
		};

		var onClick = function (elem) {
			state.push(elem.attr('href'), elem.attr('title'));
		};

		var bindEvents = function () {
			window.History.Adapter.bind(window, 'statechange', function () {
				
			});

			$(document).on('click', 'a[data-o-link]', function (e) {
				e.preventDefault();
				onClick($(this));
			});
		};

		var init = function () {
			bindEvents();

			state.push(window.location.pathname, 'Home');
		};

		init();
	};


	var app = new Boot();

})();