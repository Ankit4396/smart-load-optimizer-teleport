"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ProductContent = _1.sequelize.define("ProductContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Store id" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Category id" },
    originalName: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Product name as entered" },
    name: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "Product name with extra information" },
    description: { type: sequelize_1.DataTypes.TEXT('long'), allowNull: true, defaultValue: null, comment: "Product description" },
    descriptionText: { type: sequelize_1.DataTypes.TEXT('long'), allowNull: true, defaultValue: null, comment: "Product description" },
    keywords: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: false, comment: "keywords" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "product_contents",
});
exports.default = ProductContent;
