(function () {
	'use strict';


	var is = plankton.is;


	var defaults = {
		appendTo: 'body',
		containerClass: 'user-message',
		duration: 5000
	};


	var UserMessage = function (options) {
		var settings = $.extend({}, defaults, options);
		 

		var getDuration = function (duration) {
			return is.number(duration) ? duration : settings.duration;
		};

		
		this.success = function (message, duration, callback) {
			this.show(message, 'success', duration, callback);
		};

		this.warning = function (message, duration, callback) {
			this.show(message, 'warning', duration, callback);
		};

		this.error = function (message, duration, callback) {
			this.show(message, 'error', duration, callback);
		};

		this.show = function (message, type, duration, callback) {
			callback = callback || function () {};
			
			var container = $('<div>')
				.addClass(settings.containerClass)
				.addClass(type)
				.append(message);

			$(settings.appendTo).append(container);

			container.delay(getDuration(duration)).fadeOut('fast', function () {
				$(this).remove();
			});
		};

	};


	Oyster.register('UserMessage', UserMessage);

})();