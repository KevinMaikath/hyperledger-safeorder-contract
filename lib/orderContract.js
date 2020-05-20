/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const {Contract, Context} = require('fabric-contract-api');

// SafeOrder specific classes
const Order = require('./order.js');
const OrderList = require('./orderList.js');

/**
 * A custom context provides easy access to list of all orders
 */
class OrderContext extends Context {

    constructor() {
        super();
        // All the orders are held in the OrderList
        this.orderList = new OrderList(this);
    }

}

/**
 * Define the SafeOrder smart contract (OrderContract) by extending Fabric Contract class
 */
class OrderContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.safeorder.ordercontract');
    }

    /**
     * Define a custom context
     */
    createContext() {
        return new OrderContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
    }

    /**
     * Register a new order
     */
    async registerOrder(ctx, orderData) {
        let orderDataObject = JSON.parse(orderData.toString());

        // check if the new order has already been registered
        let existingOrder = await this.queryByID(ctx, orderDataObject.ID, orderDataObject.shopID);
        if (existingOrder) {
            throw new Error(`Order with ID: ${orderDataObject.ID} for shopID: ${orderDataObject.shopID} already exists!`)
        }

        // create a new order with the given data and add it to the ledger
        let newOrder = Order.createInstance(orderDataObject.ID, orderDataObject.date,
            orderDataObject.shopID, orderDataObject.buyerID, orderDataObject.items);
        await ctx.orderList.addOrder(newOrder);

        return newOrder;
    }

    /**
     * Query an order by its ID and shopID
     */
    async queryByID(ctx, orderID, shopID) {
        const orderKey = Order.makeKey([orderID, shopID]);
        return await ctx.orderList.getOrder(orderKey);
    }
}

module.exports = OrderContract;
