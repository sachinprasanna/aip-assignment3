'use strict';
module.exports = function(app) {
    var itemList = require('../controllers/itemListController');

    // itemList Routes
    app.route('/items')
        .get(itemList.list_all_items)
        .post(itemList.create_a_item);


    app.route('/items/:itemId')
        .get(itemList.read_a_item)
        .put(itemList.update_a_item)
        .delete(itemList.delete_a_item);
};