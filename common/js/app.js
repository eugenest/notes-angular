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
    $routeProvider.when('/notes/:id', {templateUrl: 'notes/partials/detail.html', controller: 'NotesDetailCtrl'});
    $routeProvider.when('/notes/:id/edit', {templateUrl: 'notes/partials/edit.html', controller: 'NotesEditCtrl'});

    $routeProvider.when('/404', {templateUrl: 'common/partials/404.html', controller: '404Ctrl'});

    $routeProvider.when('/', {redirectTo: '/notes'});
    $routeProvider.otherwise({redirectTo: '/404'});
}]);

app.run(function(paginationConfig){
    paginationConfig.itemsPerPage   = 5;
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