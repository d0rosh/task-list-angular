app.directive('lgsPagination', function(){
    return {
        scope:{
            ngModel:'=',
            size:'=?',
            totalPages:'='
        },
        transclude: false,
        replace:true,
        templateUrl:'pagination.html',
        require: 'ngModel',
        link: function(scope, element, attrs){
            scope.page = scope.ngModel;
            scope.pages = buildPages(scope.totalPages, scope.page);
            scope.changePage = function(page, ev){
                ev.preventDefault();
                if(page>=1&&page<=scope.totalPages){
                    scope.ngModel = page;
                    scope.page = page;
                    scope.pages = buildPages(scope.totalPages, page);
                }
            }
            scope.$watch('totalPages', function(newValue, oldValue){
                if(newValue!=oldValue){
                    if(newValue<scope.page) {
                        scope.ngModel = newValue;
                        scope.page = newValue;
                    }
                    scope.pages = buildPages(scope.totalPages, scope.page);
                }
            });
        }
    };
    function buildPages(totalPages, page){
        var pages = [];
        var visiblePages = 5;
        if(totalPages<=visiblePages){
            for(var i = 1; i <= totalPages; i++){
                pages.push(i);
            }
        } else {
            var half = Math.floor(visiblePages/2);
            var start = page - half >= 1 ? page - half : 1;
            var end = start + visiblePages - 1 > totalPages ? totalPages : start + visiblePages - 1;
            start = end - start < visiblePages - 1 ? end - visiblePages + 1 : start;
            for(; start <= end; start++){
                pages.push(start);
            }
        }
        return pages;
    }
});
app.directive('lgsSize', function(){
    return {
        scope:{
            ngModel:'=',
            sizes:'='
        },
        transclude: false,
        replace:false,
        templateUrl:'size.html',
        require: 'ngModel',
        link: function(scope, element, attrs){
            scope.isDropdownVisible = false;
            scope.triggerMenu = function(){
            scope.isDropdownVisible=!scope.isDropdownVisible
            }
            scope.changePageSize = function(size, ev){
                ev.preventDefault();
                scope.triggerMenu();
                if(size!==scope.ngModel){
                    scope.ngModel = size;
                }
            }
        }
    };
});
app.directive('lgsSort', function(){
    return {
        scope:{
            asc:'&',
            desc:'&',
            array:'=',
            label:'=?',
            value:'=?'
        },
        transclude: false,
        replace:false,
        templateUrl:'sort.html',
        link: function(scope, element, attrs){
            scope.isDropdownVisible = false;
            if(!scope.label) scope.label = 'label';
            if(!scope.value) scope.value = 'value';
            scope.data = [];
            scope.current = {};
            for(var i = 0; i < scope.array.length; i++){
                //{label: 'name, value: 'name'}
                var elem = scope.array[i];
                var pair = {};
                pair[scope.label] = elem[scope.label]+' asc';
                pair[scope.value] = elem[scope.value];
                pair.asc = true;
                elem[scope.label] = elem[scope.label]+' desc';
                elem.asc = false;
                scope.data.push(pair);
                scope.data.push(elem);
            }
            scope.triggerMenu = function(){
            scope.isDropdownVisible=!scope.isDropdownVisible
            }
            scope.changeSort = function(sort, ev){
                ev.preventDefault();
                scope.triggerMenu();
                scope.current = sort;
                if(sort.asc){
                    scope.asc({field:sort[scope.value]});
                }else{
                    scope.desc({field:sort[scope.value]}    );
                }
            }
        }
    };
});
