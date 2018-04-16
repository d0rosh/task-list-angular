app.controller('loginCtrl', function($http, $location){
    var vm = this;
    vm.save = function(request){
        $http.post('/login', request).then(
            ()=>$location.url('/'),
            (err)=>{
                if(err.status===401){
                    vm.message = 'Wrong login or password'
                }
            }
        );
    }
});