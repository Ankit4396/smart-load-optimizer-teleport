"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ProductAttribute = _1.sequelize.define("ProductAttribute", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Product id" },
    attributeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Attribute id" },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Slug of attribute value" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "product_attributes",
});
exports.default = ProductAttribute;
