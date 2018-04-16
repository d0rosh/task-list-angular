app.controller('itemCtrl', function($scope, $filter, $http){
    var vm = this;
    vm.items = []
    vm.categories = [];
    vm.currentItem = {};
    vm.id = 6;
    vm.search = '';
    vm.min = '';
    vm.max = '';
    vm.page = 1;
    vm.size = 2;
    vm.pageSizes = [1, 5, 10];
    vm.pageCount = Math.ceil(vm.items.length/vm.size);
    vm.sorts = [
        {label: 'name', value: 'name'},
        {label: 'price', value: 'price'}
    ];
    vm.ascSort = function(field){
        console.log(field);
        vm.items.sort(function(e1, e2){
            return e1[field] > e2[field];
        });
    }
    vm.descSort = function(field){
        console.log(field);
        vm.items.sort(function(e1, e2){
            return e1[field] < e2[field];
        });
    }
    $scope.$watch('ctrl.search', function(newValue, oldValue){
        if(newValue!==oldValue){
            vm.updatePage();
        }
    });
    $scope.$watch('ctrl.size', function(newValue, oldValue){
        if(newValue!==oldValue){
            vm.updatePage();
        }
    });
    vm.refresh = function(){
        $http.get('/items').then(function(res){
            vm.items = res.data;
            console.log(vm.items);
            vm.updatePage();
        }, function(err){
            console.log(err);
        });
        $http.get('/categories').then(function(res){
            vm.categories = res.data;
        }, function(err){
            console.log(err);
        });
    }
    vm.refresh();
    vm.updatePage = function(){
        var array = $filter('searchItem')(vm.items, vm.search);
        array = $filter('minMaxPrice')(array, vm.min, vm.max);
        vm.pageCount = Math.ceil(array.length/vm.size);
    }
    vm.save = function(){
        console.log(vm.currentItem.category.name);
        if(vm.currentItem._id){
            $http.put(`/items/${vm.currentItem._id}`, vm.currentItem)
            .then(updateItem, errHandler);
        }else{
            $http.post('/items', vm.currentItem)
            .then(addItem, errHandler);
        }
    }
    function addItem(res){
        vm.items.push(res.data);
        vm.currentItem = {};
    }
    function errHandler(err){
        console.log(err);
    }
    function updateItem(){
        var index = findItemIndex(vm.currentItem._id);
        spliceItems(index, vm.currentItem);
        vm.currentItem = {};
    }
    vm.update = function(item){
        vm.currentItem = angular.copy(item);
    }
    vm.delete = function(id){
        $http.delete(`/items/${id}`).then(deleteItem(id), errHandler);
    }
    function deleteItem(id){
        return function(){
            var index = findItemIndex(id);
            spliceItems(index);
            vm.updatePage();
        }
    }
    function findItemIndex(id){
        return vm.items.findIndex(e=>e._id==id); 
    }
    function spliceItems(index, elem){
        switch (arguments.length){
            case 1:{
                vm.items.splice(index, 1);
                break;
            }
            case 2:{
                vm.items.splice(index, 1, elem);
            }
        }
    }
});