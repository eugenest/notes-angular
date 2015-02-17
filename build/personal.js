'use strict';

var app = angular.module('notes', [
    'ngRoute',
    'notes.filters',
    'notes.services',
    'notes.directives',
    'notes.controllers',
    'ui.bootstrap',
    'angularSpinner',
]);

app.config(['$routeProvider', function($routeProvider) { 
    $routeProvider.when('/notes', {templateUrl: 'notes/partials/list.html', controller: 'NotesCtrl'});
    $routeProvider.when('/notes/add', {templateUrl: 'notes/partials/add.html', controller: 'NotesAddCtrl'});
    $routeProvider.when('/notes/:id/edit', {templateUrl: 'notes/partials/edit.html', controller: 'NotesEditCtrl'});

    $routeProvider.when('/404', {templateUrl: 'common/partials/404.html', controller: '404Ctrl'});

    $routeProvider.when('/', {redirectTo: '/notes'});
    $routeProvider.otherwise({redirectTo: '/404'});
}]);

app.run(function(paginationConfig){
    paginationConfig.itemsPerPage   = 20;
    paginationConfig.previousText   = "‹";
    paginationConfig.nextText       = "›";
    paginationConfig.firstText      = "«";
    paginationConfig.lastText       = "»";
});

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({
        lines: 12
    });
}]);

var appControllers = angular.module('notes.controllers', []);
var appDirectives = angular.module('notes.directives', []);
var appFilters = angular.module('notes.filters', []);
var appServices = angular.module('notes.services', []);
appControllers.controller('appCtrl', ['$scope', '$modal', 'paginationConfig', 'usSpinnerService', function($scope, $modal, paginationConfig, usSpinnerService) {
    $scope.loadCurrentScopeData = function(){
        $scope.$broadcast('loadElements');
    };
}]);

appControllers.controller('404Ctrl', ['$scope', function($scope) {

}]);
appDirectives.directive('serverErrorAlert', function(){
    return {
        restrict: 'E',
        templateUrl: 'common/partials/server-error-alert.html'
    };
});
appFilters.filter('startFrom', function() {
	return function(input, start) {
		//console.log(input);
		start = +start;
		if (input !== undefined && input !== null){
			return input.slice(start);
		}
	};
});
appControllers.controller('NotesCtrl', ['$scope', 'Notes', 'paginationConfig', '$location', 'usSpinnerService', function($scope, Notes, paginationConfig, $location, usSpinnerService) {

}]);

appControllers.controller('NotesEditCtrl', ['$scope', 'Notes', 'paginationConfig', '$location', '$routeParams', 'usSpinnerService', '$filter', function($scope, Notes, paginationConfig, $location, $routeParams, usSpinnerService, $filter) {

}]);

appControllers.controller('NotesAddCtrl', ['$scope', 'Notes', 'paginationConfig', '$rootScope', '$location', 'usSpinnerService', function($scope, Notes, paginationConfig, $rootScope, $location, usSpinnerService) {
    
}]);
appServices.factory('Notes', function($http){
    return {
        getAll: function(){return $http.get('http://notes.eugenes.koding.io/web/notes/index');},
        getItem: function(){return $http.get('http://notes.eugenes.koding.io/web/notes/index');},
        edit: function (request) {return $http.put('http://notes.eugenes.koding.io/web/notes/edit', request);},
        add: function (request) {return $http.post('http://notes.eugenes.koding.io/web/notes/add', request);},
        csv: function (id) {return $http.get('http://notes.eugenes.koding.io/web/notes/csv');},
        mail: function (id) {return $http.get('http://notes.eugenes.koding.io/web/notes/mail');},
    };
});