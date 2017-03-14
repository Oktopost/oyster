(function () {
	'use strict';


	var Link = function () {

		this.bindClicks = function (callback) {
			$(document).on('click', 'a[data-o-link]', function (e) {
				e.preventDefault();
				callback($(this));
			});
		};

	};


	Oyster.register('Link', Link);

})();