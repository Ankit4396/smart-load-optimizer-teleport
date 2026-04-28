"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const AppVersion = _1.sequelize.define("AppVersion", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    ios_soft_update: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "IOS software update" },
    ios_critical_update: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "IOS Critical update" },
    android_soft_update: { type: sequelize_1.DataTypes.FLOAT, allowNull: true, defaultValue: null, comment: "Android Software Update " },
    android_critical_update: { type: sequelize_1.DataTypes.FLOAT, allowNull: true, defaultValue: null, comment: "Android Critical Update" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "app_version",
    indexes: []
});
exports.default = AppVersion;
