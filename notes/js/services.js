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