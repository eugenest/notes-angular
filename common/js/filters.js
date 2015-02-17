appFilters.filter('startFrom', function() {
	return function(input, start) {
		//console.log(input);
		start = +start;
		if (input !== undefined && input !== null){
			return input.slice(start);
		}
	};
});