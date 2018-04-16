app.controller('categoryCtrl', function($http){
    var vm = this;
    vm.categories = [];
    vm.currentCategory = {};
    
    vm.refresh = function(){
        $http.get('/categories')
            .then(createCategories, errHandler);
    }
    vm.refresh();
    vm.save = function(){
        if (vm.currentCategory._id) {
            $http.put(
                '/categories/'+vm.currentCategory._id,
                vm.currentCategory)
                .then(updateCategory(vm.currentCategory), errHandler);
        } else {
            $http.post('/categories', vm.currentCategory)
            .then(addCategory, errHandler);
        }
        vm.currentCategory = {};
    }
    vm.update = function(category){
        vm.currentCategory = angular.copy(category);
//        vm.currentCategory = category;
    }
    vm.cancel = function(){
        vm.currentCategory = {};
    }
    vm.delete = function(id){
        $http.delete('/categories/'+id)
        .then(deleteCategory(id), errHandler);
    }
    function updateCategory(category){
        return function updateCategory(res){
            var index = vm.categories.findIndex(e=>e._id==category._id);
            vm.categories.splice(index, 1, category);
        }
    }
    function deleteCategory(id){
        return function(res){
            var index = vm.categories.findIndex(e=>e._id==id);
            vm.categories.splice(index, 1);
        }
    }
    function createCategories(res){
        vm.categories = res.data;
    }
    function addCategory(res) {
        vm.categories.push(res.data);
    }
    function errHandler(err){
        console.log(err);
    }
});