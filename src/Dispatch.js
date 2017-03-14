(function () {
	'use strict';


	var Dispatch = function () {

		this.stateChange = function (controller) {
			Oyster.instance('Controller').init(controller);
		};

	};


	Oyster.register('Dispatch', Dispatch);

})();