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