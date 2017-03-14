(function () {
	'use strict';


	var Controller = function () {
		
		this.init = function (controller) {
			Oyster.instance('Layout').render('layout');
			Oyster.instance(controller).render();
		};
		
	};


	Oyster.register('Controller', Controller);

})();