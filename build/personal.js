'use strict';

var app = angular.module('notes', [
    'ngRoute',
    'notes.filters',
    'notes.services',
    'notes.directives',
    'notes.controllers',
    'ui.bootstrap',
    'angularSpinner',
    'angularFileUpload'
]);

app.config(['$routeProvider', function($routeProvider) { 
    $routeProvider.when('/notes', {templateUrl: 'notes/partials/list.html', controller: 'NotesCtrl'});
    $routeProvider.when('/notes/add', {templateUrl: 'notes/partials/add.html', controller: 'NotesAddCtrl'});
    $routeProvider.when('/notes/:id', {templateUrl: 'notes/partials/detail.html', controller: 'NotesDetailCtrl'});
    $routeProvider.when('/notes/:id/edit', {templateUrl: 'notes/partials/edit.html', controller: 'NotesEditCtrl'});
    $routeProvider.when('/notes/:id/mail', {templateUrl: 'notes/partials/mail.html', controller: 'NotesMailCtrl'});

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
appControllers.controller('appCtrl', ['$scope', '$modal', 'paginationConfig', 'usSpinnerService', function($scope, $modal, paginationConfig, usSpinnerService) {
    $scope.$on('openBlob', function(event, response, id) {
        /*var file = new Blob([response], {type: 'text/csv'}); //blocks by browser
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);*/

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response], {type: 'text/csv'});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'note_'+id+'.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    });
}]);

appControllers.controller('404Ctrl', ['$scope', function($scope) {

}]);
appDirectives.directive('serverErrorAlert', function(){
    return {
        restrict: 'E',
        templateUrl: 'common/partials/server-error-alert.html'
    };
});

appDirectives.directive('topHeader', function(){
    return {
        restrict: 'E',
        templateUrl: 'common/partials/top-header.html'
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
    $scope.itemsOnPage = paginationConfig.itemsPerPage;
    
    $scope.$on('loadNotes', function(){
        $scope.isThereNoElements = false;
        $scope.isServerError = false;
        usSpinnerService.spin('elements-spinner');
        Notes.getAll().success(function(response, status){
            switch(status) {
                case 204:
                    $scope.isThereNoElements = true;
                    break;
                case 200:
                    $scope.elements = response;
                    $scope.totalItems = $scope.elements.length;
                    break;
                default:
                    break;
            }
        }).error(function(response, status){
            switch (status){
                case 502:
                case 500:
                default: $scope.isServerError = true;
            }
        }).finally(function(){
            usSpinnerService.stop('elements-spinner');
            $scope.isElementsLoaded = true;
        });
    });
    
    $scope.$emit('loadNotes');
    
    $scope.deleteNote = function(id) {
        Notes.delete(id).success(function(){
            $scope.$emit('loadNotes');
        });
    }
    
    $scope.getCSV = function(id) {
        Notes.csv(id).success(function(response){
            $scope.$emit('openBlob', response, id);
        }); 
    }
}]);

appControllers.controller('NotesDetailCtrl', ['$scope', 'Notes', 'paginationConfig', '$location', '$routeParams', 'usSpinnerService', '$filter', function($scope, Notes, paginationConfig, $location, $routeParams, usSpinnerService, $filter) {
    $scope.isThereNoElements = false;
    $scope.isServerError = false;
    usSpinnerService.spin('elements-spinner');
    Notes.getItem($routeParams.id).success(function(response, status){
        switch(status) {
            case 204:
                $scope.isThereNoElements = true;
                break;
            case 200:
                $scope.element = response;
                break;
            default:
                break;
        }
    }).error(function(response, status){
        switch (status){
            case 502:
            case 500:
            default: $scope.isServerError = true;
        }
    }).finally(function(){
        usSpinnerService.stop('elements-spinner');
        $scope.isElementsLoaded = true;
    });
    
    $scope.deleteNote = function(id) {
        Notes.delete(id).success(function(){
            $location.path('/notes', false);
        }); 
    }
    
    $scope.getCSV = function(id) {
        Notes.csv(id).success(function(response){
            $scope.$emit('openBlob', response, id);
        }); 
    }
}]);

appControllers.controller('NotesAddCtrl', ['$scope', 'Notes', 'paginationConfig', '$rootScope', '$location', 'usSpinnerService', '$upload', function($scope, Notes, paginationConfig, $rootScope, $location, usSpinnerService, $upload) {
    $scope.isNoteAdded = true;
    $scope.element = {};
     
    $scope.addNote = function() {
        $scope.isNoteAdded = false;
        $scope.isNoteAddServerError = false;
        $scope.isNoteAddServerSuccess = false;
        Notes.add($scope.element).success(function(){
            $scope.isNoteAddServerSuccess = true;
        }).error(function(){
            $scope.isNoteAddServerError = true;
        }).finally(function(){
            $scope.isNoteAdded = true;
            $scope.element = {};
        }); 
    }

    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'common/back/upload.php', 
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    $scope.element.image = '/upload/' + config.file.name;
                    console.log('File ' + config.file.name + ' uploaded.');
                });
            }
        }
    };
}]);

appControllers.controller('NotesEditCtrl', ['$scope', 'Notes', 'paginationConfig', '$location', '$routeParams', 'usSpinnerService', '$filter', '$upload', function($scope, Notes, paginationConfig, $location, $routeParams, usSpinnerService, $filter, $upload) {
    $scope.isNoteEdited = true;
    $scope.isThereNoElements = false;
    $scope.isServerError = false;
    usSpinnerService.spin('elements-spinner');
    Notes.getItem($routeParams.id).success(function(response, status){
        switch(status) {
            case 204:
                $scope.isThereNoElements = true;
                break;
            case 200:
                $scope.element = response;
                break;
            default:
                break;
        }
    }).error(function(response, status){
        switch (status){
            case 502:
            case 500:
            default: $scope.isServerError = true;
        }
    }).finally(function(){
        usSpinnerService.stop('elements-spinner');
        $scope.isElementsLoaded = true;
    });
    
    $scope.editNote = function() {
        $scope.isNoteEdited = false;
        $scope.isNoteAddServerError = false;
        $scope.isNoteAddServerSuccess = false;
        Notes.edit($scope.element).success(function(){
            $scope.isNoteEditServerSuccess = true;
        }).error(function(){
            $scope.isNoteEditServerError = true;
        }).finally(function(){
            $scope.isNoteEdited = true;
        }); 
    }
    
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'common/back/upload.php', 
                    file: file
                }).progress(function (evt) {
                }).success(function (data, status, headers, config) {
                    $scope.element.image = '/upload/' + config.file.name;
                    //console.log('File ' + config.file.name + ' uploaded.');
                });
            }
        }
    };
}]);

appControllers.controller('NotesMailCtrl', ['$scope', '$routeParams', 'Notes', 'paginationConfig', '$rootScope', '$location', 'usSpinnerService', function($scope, $routeParams, Notes, paginationConfig, $rootScope, $location, usSpinnerService) {
    $scope.isNoteSended = true;
     
    $scope.sendNote = function() {
        $scope.isNoteSended = false;
        $scope.isNoteSendServerError = false;
        $scope.isNoteSendServerSuccess = false;
        Notes.mail({id: $routeParams.id, email: $scope.email}).success(function(){
            $scope.isNoteSendServerSuccess = true;
        }).error(function(){
            $scope.isNoteSendServerError = true;
        }).finally(function(){
            $scope.isNoteSended = true;
            $scope.element = null;
        }); 
    }
}]);
appServices.factory('Notes', function($http){
    return {
        getAll: function(){return $http.get('http://notes.eugenes.koding.io/web/note/');},
        getItem: function(id){return $http.get('http://notes.eugenes.koding.io/web/notes/' + id);},
        add: function (request) {return $http.post('http://notes.eugenes.koding.io/web/notes', request);},
        edit: function (request) {return $http.put('http://notes.eugenes.koding.io/web/notes/'+request.id, request);},
        delete: function (id) {return $http.delete('http://notes.eugenes.koding.io/web/notes/'+id);},
        csv: function (id) {return $http.get('http://notes.eugenes.koding.io/web/notes/csv?id='+id);},
        //mail: function (request) {return $http.post('http://notes.eugenes.koding.io/web/notes/mail', request);} //doesn't works
        mail: function (request) {
            return $http({
                method: 'POST',
                url: 'http://notes.eugenes.koding.io/web/notes/mail',
                data: request,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept' : '*/*'
                }
            });
        }
    };
});