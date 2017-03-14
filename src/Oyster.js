(function () { 
	'use strict';

	var baseName = 'Oyster';

	window[baseName] = window[baseName] || {};


	/**
	 * @param {string} name
	 * @return {object|function}
	 */
	var get = function (name) {	
		var namespace = window[baseName];
		var names = name.split('.');
		
		for (var i = 0; i < names.length - 1; i++) {
			if (typeof namespace[names[i]] === 'undefined') {
				namespace[names[i]] = {};
			}

			namespace = namespace[names[i]];
		}
		
		return namespace;
	};

	/**
	 * @param {string} namespace
	 * @param {object|function} extendBy
	 * @param {boolean} override
	 */
	var register = function (namespace, extendBy, override) {
		override = override || true;

		var namespaceObject = get(namespace);
		var namespaceObjectName = namespace.split('.').slice(-1)[0];

		if (override) {
			namespaceObject[namespaceObjectName] = extendBy;
		}
	};

	/**
	 * @param {string} name
	 * @param {object|string} options
	 * @returns {object|function}
	 */
	var instance = function (name, options) {
		options = options || null;

		var namespaceObject = get(name);
		var namespaceObjectName = name.split('.').slice(-1)[0];
		var namespaceObjectType = typeof namespaceObject[namespaceObjectName];


		if (namespaceObjectType === 'function') {
			return new namespaceObject[namespaceObjectName](options);
		} 

		if (namespaceObjectType === 'object') {
			return namespaceObject[namespaceObjectName];
		}
		
		throw 'Unknown Oyster: ' + namespaceObjectName;
	};


	window[baseName]['register'] = register;
	window[baseName]['instance'] = instance;

})();