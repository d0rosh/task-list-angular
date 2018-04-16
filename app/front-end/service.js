app.service('global', function(){
    function Global(){
        var _items = [];
        var _itemId = 1;
        this.getItems = function(){
            return _items;
        }
        this.getItemId = function(){
            return _itemId;
        }
        this.setItemId = function(itemId){
            if(itemId<_itemId) throw new Error("Item id can`t be lesser than existing item id");
            _itemId = itemId;
        }
    }
    return new Global();
});