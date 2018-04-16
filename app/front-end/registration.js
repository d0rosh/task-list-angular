app.controller('registrationCtrl', function($http, $location){
    var vm = this;
    vm.save = function(request){
        $http.post('/registration', request).then(
            ()=>$location.url('/login'),
            (err)=>console.log('err')
        );
    }
});