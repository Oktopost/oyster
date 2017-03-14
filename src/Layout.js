(function () {
	'use strict';


	var Layout = function () {

		var view = function () {
			return Oyster.instance('View', 'layouts');
		};


		this.render = function (filename, data) {
			data = data || {};

			$('main').empty().append(view().get(filename, data));
		};

	};

	
	Oyster.register('Layout', Layout);

})();