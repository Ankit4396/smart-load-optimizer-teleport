"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const ShopContent = _1.sequelize.define("ShopContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    shopId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "" },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    description: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "shop_contents",
    indexes: []
});
exports.default = ShopContent;
