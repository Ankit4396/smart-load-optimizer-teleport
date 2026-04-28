"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ProductKeywordContent = _1.sequelize.define("ProductKeywordContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productKeywordId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Product keyword id" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Lanuage id" },
    value: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Keyword value" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "product_keyword_contents",
});
exports.default = ProductKeywordContent;
