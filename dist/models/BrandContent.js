"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const BrandContent = _1.sequelize.define("BrandContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    brandId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Brand id" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Language id" },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "Name of the brand" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "brand_contents",
});
exports.default = BrandContent;
