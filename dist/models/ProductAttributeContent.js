"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ProductAttributeContent = _1.sequelize.define("ProductAttributeContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productAttributeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Product attribute id" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Lanuage id" },
    value: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Attribute value" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "product_attribute_contents",
});
exports.default = ProductAttributeContent;
