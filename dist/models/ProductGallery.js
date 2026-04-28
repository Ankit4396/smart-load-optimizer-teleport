"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ProductGallery = _1.sequelize.define("ProductGallery", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Product id" },
    attachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Attachment id" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "product_gallery",
});
exports.default = ProductGallery;
