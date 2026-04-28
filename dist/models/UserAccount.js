"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const UserAccount = _1.sequelize.define("UserAccount", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'user-identity', comment: "User's ref id" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, unique: 'user-identity', comment: "User's account id, if null, its a super user account/subaccount" },
    isDefault: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, comment: "If account is set as default" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "users_accounts",
    indexes: []
});
exports.default = UserAccount;
