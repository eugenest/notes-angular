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