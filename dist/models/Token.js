"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
let Token = _1.sequelize.define("Token", {
    id: {
        type: sequelize_1.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "Event for which token is generated" },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "Email ID for which token is valid" },
    username: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "username for which token is valid" },
    countryCode: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "Country code" },
    mobile: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "Mobile No" },
    dob: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "DOB" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "User identifier for which token has been generated" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "User's account identifier for which token has been generated" },
    token: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Generated jwt token" },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "Verification code for which tokwn will stand valid" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Validation status of token, 0->used, 1-> Not Used" },
    allowedAttempts: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Number of allowed attempts for verification" },
    verificationsAttempts: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Number of attempts with invalid code to verify token" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "tokens",
    indexes: [
        { name: 'account_user', fields: ['account_id', 'user_id'] },
        { name: 'type', fields: ['type', 'email', 'user_id'] }
    ]
});
exports.default = Token;
