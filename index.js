var root = require('oktopost-namespace').dynamic(__dirname);
module.exports = root.Oyster;



namespace('Oktopost.Routes', function (window) 
{
	var Actions = window.Oktopost.Actions;
	
	
	/**
	 * @name Oktopost
	 * @memberOf window
	 */
	
	/**
	 * @name Routes
	 * @memberOf window.Oktopost
	 */
	
	/**
	 * @name Assignments
	 * @memberOf Oktopost.Routes
	 */
	var Assignments = {
		$: 
		{
			path: 'assignment',
			action: Actions.AssignmentIndexAction
		},
		
		Search: 
		{
			$: 
			{
				path: 'search',
				query: 
				{
					'id': { value: 0, type: 'int' } 
				},
				action: Actions.Assignment.SearchAction
			}
		},
		
		
	};
	
	
	function create(actions, route)
	{
		
	}
});




namespace('something', function (window) 
{
	
});