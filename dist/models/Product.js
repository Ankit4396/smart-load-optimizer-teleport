"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Product = _1.sequelize.define("Product", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    storeId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Store id" },
    categoryId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Category id" },
    brandId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Category id" },
    parentProductId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: false, comment: "Parent product id" },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "unique code for brand created, generated from title" },
    attachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Product main image" },
    basePrice: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0, comment: "Product base price" },
    sku: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "unique sku" },
    rentalDurationType: { type: sequelize_1.DataTypes.TINYINT, defaultValue: 0, comment: "" },
    rentalDuration: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "" },
    rentalPrice: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0, comment: "" },
    securityDeposit: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0, comment: "" },
    prepDays: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "" },
    preLovedPrice: { type: sequelize_1.DataTypes.DECIMAL(10, 2), defaultValue: 0, comment: "" },
    dimmensions: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "" },
    weight: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "" },
    weightUnit: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "" },
    productType: { type: sequelize_1.DataTypes.TINYINT, allowNull: true, defaultValue: null, comment: "1=>Rent, 2=>Buy, 3=>preloved" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    approvalStatus: { type: sequelize_1.DataTypes.TINYINT, defaultValue: 0, comment: "Status of Product. 0-> Inactive, 1-> Active" },
    status: { type: sequelize_1.DataTypes.TINYINT, defaultValue: 0, comment: "Status of Product. 0-> Inactive, 1-> Active" },
    reason: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "Reason for rejection" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "products",
});
exports.default = Product;
