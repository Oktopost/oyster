(function () {
	'use strict';


	var is = plankton.is;


	var defaults = {
		onDone: null,
		onFail: null,
		onComplete: null,
		onSend: null
	};


	var Model = function (options) {
		var settings = $.extend({}, defaults, options);


		var getRequest = function (url, type, params) {
			var request = {
				url: url,
				type: type,
				dataType: 'json'
			};

			if (is.object.notEmpty(params)) {
				request.data = params;
			}

			if (is.function(settings.onSend)) {
				request.beforeSend = settings.onSend;
			}

			return request;
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