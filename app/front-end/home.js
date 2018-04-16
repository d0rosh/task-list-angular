app.controller('homeCtrl', function(global){
    var vm = this;
    console.log(global)
    vm.items = global.getItems();
});