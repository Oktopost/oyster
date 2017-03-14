(function () {
	'use strict';


	var TestController = function () {

		var view = function () {
			return Oyster.instance('View', 'index');
		};


		this.render = function () {
			$('main > div.inner').append(view().get('test', {}));
		};

	};


	Oyster.register('TestController', TestController);

})();