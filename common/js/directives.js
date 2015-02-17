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