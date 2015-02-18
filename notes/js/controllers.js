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