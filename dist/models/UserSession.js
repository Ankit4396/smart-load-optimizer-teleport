"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const UserSession = _1.sequelize.define("UserSession", {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Unique user identifier" },
    deviceToken: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "FCM token" },
    deviceType: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "Device type" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, allowNull: false, comment: "Status" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "user_sessions",
    indexes: []
});
exports.default = UserSession;
