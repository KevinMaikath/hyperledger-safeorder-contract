/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const StateList = require('../ledger-api/statelist.js');
const Order = require('./order.js');

/**
 * References a specific state object list in the ledger
 */
class OrderList extends StateList {

    constructor(ctx) {
        super(ctx, OrderList.getListName());
        this.use(Order);
    }

    static getListName() {
        return 'org.safeorder.orderlist';
    }

    async addOrder(order) {
        return this.addState(order);
    }

    async getOrder(orderKey) {
        return this.getState(orderKey);
    }

    async updateOrder(order) {
        return this.updateState(order);
    }
}


module.exports = OrderList;
