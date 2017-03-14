(function () {
	'use strict';


	var is = plankton.is;


	var Storage = function () {

		this.log = function () {
			console.log(sessionStorage);
		};

		/**
		 * @param {string} key
		 * @param {mixed} value
		 */
		this.set = function (key, value) {	
			if (is.object(value)) {
				value = JSON.stringify(value);
			}	

			sessionStorage[key] = value;
		};

		/**
		 * @param {string} key
		 * @param {mixed} defaultValue
		 * @return {mixed}
		 */
		this.get = function (key, defaultValue) {
			switch (typeof sessionStorage[key]) {
				case 'number':
					return sessionStorage[key];
				case 'undefined':
					return is.undefined(defaultValue) ? '' : defaultValue;
				case 'string':
					try {
						return JSON.parse(sessionStorage[key]);
					}
					catch (e) {
						return sessionStorage[key];
					}
			}
		};

		/**
		 * @param {string} key
		 */
		this.remove = function (key) {
			if (is.defined(sessionStorage[key])) {
				sessionStorage.removeItem(key);
			}
		};

		this.reset = function () {
			sessionStorage.clear();
		};
	};

	
	Oyster.register('Storage', Storage);

})();