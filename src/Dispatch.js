(function () {
	'use strict';


	var Dispatch = function () {

		var getAction = function (parts) {
			return typeof parts[1] !== 'undefined' ? parts[1] : 'index';
		};

		var getController = function (parts) {
			return parts[0].length ? parts[0] : 'index';
		};

		var getRoute = function (url) {
			var parsed = Oyster.instance('Url', url).parse();
			var parts = parsed.pathname.substring(1).split('/');
			
			return {
				controller: getController(parts),
				action: getAction(parts)
			}
		};


		/**
		 * @param {object} newState
		 */
		this.stateChange = function (newState) {
			var controller = Oyster.instance('Controller');
			var route = getRoute(newState.url);

			controller.init(route.controller, route.action);
		};
	};


	Oyster.register('Dispatch', Dispatch);

})();