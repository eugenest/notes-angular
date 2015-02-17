appControllers.controller('NotesCtrl', ['$scope', 'Notes', 'paginationConfig', '$location', 'usSpinnerService', function($scope, Notes, paginationConfig, $location, usSpinnerService) {
    $scope.itemsOnPage = paginationConfig.itemsPerPage;
    
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
    
    $scope.deleteNote = function(id, index) {
        Notes.delete(id).success(function(){
            $scope.elements.splice(index, 1);
        }).error(function(){
            
        }); 
    }
    
    $scope.getCSV = function(id) {
        Notes.csv(id).success(function(response){
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
            
        }).error(function(){
            
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
        }).error(function(){
            
        }); 
    }
    
    $scope.getCSV = function(id) {
        Notes.csv(id).success(function(response){
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
            
        }).error(function(){
            
        }); 
    }
}]);

appControllers.controller('NotesAddCtrl', ['$scope', 'Notes', 'paginationConfig', '$rootScope', '$location', 'usSpinnerService', function($scope, Notes, paginationConfig, $rootScope, $location, usSpinnerService) {
    $scope.isNoteAdded = true;
     
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
            $scope.element = null;
        }); 
    }
}]);

appControllers.controller('NotesEditCtrl', ['$scope', 'Notes', 'paginationConfig', '$location', '$routeParams', 'usSpinnerService', '$filter', function($scope, Notes, paginationConfig, $location, $routeParams, usSpinnerService, $filter) {
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