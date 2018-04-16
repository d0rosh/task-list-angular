var app = angular.module('app',['ngRoute']);
app.config(function($routeProvider, $locationProvider){
    $routeProvider.when('/', {
        templateUrl: '/home.html',
        controller: 'homeCtrl',
        controllerAs: 'ctrl'
    });
    $routeProvider.when('/item', {
        templateUrl: '/item.html',
        controller: 'itemCtrl',
        controllerAs: 'ctrl'
    });
    $routeProvider.when('/category', {
        templateUrl: '/category.html',
        controller: 'categoryCtrl',
        controllerAs: 'ctrl'
    });
    $routeProvider.when('/registration', {
        templateUrl: '/registration.html',
        controller: 'registrationCtrl',
        controllerAs: 'ctrl'
    });
    $routeProvider.when('/login', {
        templateUrl: '/login.html',
        controller: 'loginCtrl',
        controllerAs: 'ctrl'
    });
//    $locationProvider.html5Mode(true);
});
app.filter('uah', function(){
    return function(element){
        if(!element) return;
        if(element>100){
            return element + " \u20B4";
        } else {
            return element + ".00" + " \u20B4";
        }
    }
});
app.filter('searchItem', function(){
    return function(array, search){
        if(!search) return array;
        var lowerCase = search.toLowerCase();
//        return array.map(element=>element.toLowerCase())
//        .filter(element=>element.indexOf(lowerCase)>-1);
        var filtered = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].name.toLowerCase()
               .indexOf(search.toLowerCase())>-1){
                filtered.push(array[i]);
            }
        }
        return filtered;
    };
});
app.filter('minMaxPrice', function(){
    return function(array, min, max){
        if(!min&&!max) return array;
        return array.filter(test(min, max));
    };
    function test(min, max){
        if(min&&max){
            return function(testment){ 
                return testment.price>=min && testment.price<=max;
            }
        }else if(min){
            return function(testment){
                return testment.price>=min;
            }
        }else if(max){
            return function(testment){
                return testment.price<=max;
            }
        }
    }
});
