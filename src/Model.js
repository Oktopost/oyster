(function () {
	'use strict';


	var is = plankton.is;


	var defaults = {
		onDone: null,
		onFail: null,
		onComplete: null
	};


	var Model = function (options) {
		var settings = $.extend({}, defaults, options);


		var getRequest = function (url, type, params) {
			return {
				url: url,
				type: type,
				dataType: 'json',
				data: params
			};
		};

		var sendRequest = function (request) {
			var xhr = $.ajax(request);

			if (is.function(settings.onDone)) {
				xhr.done(settings.onDone);
			}

			if (is.function(settings.onFail)) {
				xhr.fail(settings.onFail);
			}

			if (is.function(settings.onComplete)) {
				xhr.always(settings.onComplete);
			}

			return xhr;
		};

		
		this.get = function (url, params) {
			params = params || {};
			return sendRequest(getRequest(url, 'GET', params));
		};
		
		this.post = function (url, params) {
			params = params || {};
			return sendRequest(getRequest(url, 'POST', params));
		};
	};

	
	Oyster.register('Model', Model);

})();