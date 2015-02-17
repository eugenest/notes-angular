appControllers.controller('appCtrl', ['$scope', '$modal', 'paginationConfig', 'usSpinnerService', function($scope, $modal, paginationConfig, usSpinnerService) {
    $scope.loadCurrentScopeData = function(){
        $scope.$broadcast('loadElements');
    };
}]);

appControllers.controller('404Ctrl', ['$scope', function($scope) {

}]);