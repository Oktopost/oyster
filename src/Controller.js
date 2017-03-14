(function () {
	'use strict';


	var Controller = function () {
		
		this.init = function (controller) {
			var layout = Oyster.instance('Layout');
			var appController = Oyster.instance(controller.capitalize() + 'Controller');
			
			layout.render('layout');
			appController.render();
		};
		
	};


	Oyster.register('Controller', Controller);

})();