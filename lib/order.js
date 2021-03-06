/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

/**
 * Order class extends State class
 * Class will be used by application and smart contract to define and retrieve an Order
 */
class Order extends State {

    ID = '';
    date = '';
    status = '';
    shopID = '';
    buyerID = '';
    items = [];
    totalPrice = 0;
    taxes = 0.1;

    constructor(obj) {
        super(Order.getClass(), [obj.ID, obj.shopID]);
        Object.assign(this, obj);
    }

    /**
     * Getters and setters
     */
    getID() {
        return this.ID;
    }

    getDate() {
        return this.date;
    }

    setDate(newDate) {
        this.date = newDate;
    }

    getStatus() {
        return this.status;
    }

    setStatus(newStatus) {
        this.status = newStatus;
    }

    getShopID() {
        return this.shopID;
    }

    getBuyerID() {
        return this.buyerID;
    }

    getItems() {
        return this.items;
    }

    setItems(newItems) {
        this.items = newItems;
    }

    getTotalPrice() {
        return this.totalPrice;
    }

    /**
     * Data methods
     */
    calculateTotalPrice() {
        this.totalPrice = 0;
        this.items.forEach(item => {
            this.totalPrice += item.price * item.quantity;
        });
        this.totalPrice += this.totalPrice * this.taxes;
    }

    /**
     * Useful methods to encapsulate state objects
     */

    static fromBuffer(buffer) {
        return Order.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize state data to an Order object
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Order);
    }

    /**
     * Factory method to create an Order object
     */
    static createInstance(ID, date, shopID, buyerID, items) {
        if (ID.length !== 5) {
            throw new Error('Invalid Order ID')
        }
        const order = new Order({ID, date, shopID, buyerID, items});
        order.setStatus('pending');
        order.calculateTotalPrice();
        return order;
    }

    static getClass() {
        return 'org.safeorder.order';
    }
}

module.exports = Order;
