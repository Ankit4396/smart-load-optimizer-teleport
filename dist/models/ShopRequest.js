"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ShopRequest = _1.sequelize.define("ShopRequest", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "User ref id" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "User ref id" },
    shopName: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "User  name" },
    requestObject: { type: sequelize_1.DataTypes.JSON, allowNull: true, defaultValue: null, comment: "User  name" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Status of user. 0-> Inactive, 1-> Active, 2-> not verified" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "shop_requests",
    indexes: []
});
exports.default = ShopRequest;
