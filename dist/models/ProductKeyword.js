"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ProductKeyword = _1.sequelize.define("ProductKeyword", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Product id" },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "unique code for keyword created, generated from title" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "product_keywords",
});
exports.default = ProductKeyword;
