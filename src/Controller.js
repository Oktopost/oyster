(function () {
	'use strict';


	var Controller = function () {
		
		this.init = function (controller) {			
			Oyster.instance(controller).render();
		};
		
	};


	Oyster.register('Controller', Controller);

})();