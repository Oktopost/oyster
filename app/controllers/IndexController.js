(function () {
	'use strict';


	var IndexController = function () {

		var view = function () {
			return Oyster.instance('View', 'index');
		};


		this.render = function () {
			$('main > div.inner').append(view().get('index', {}));
		};

	};


	Oyster.register('IndexController', IndexController);

})();