"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const SellerProfile = _1.sequelize.define("SellerProfile", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'user-profile', comment: "User ref id" },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "User  name" },
    contactEmail: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "User  name" },
    contactCountryCode: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "User  name" },
    contactPhone: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "User  name" },
    storeUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "User  name" },
    socialMediaLink: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "User  name" },
    hasSellerAccount: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false, comment: "user enrolled for seller or not" },
    attachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "User Profile image" },
    isStripeConnected: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: false, comment: "User Profile image" },
    isVerifiedDocuments: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: false, comment: "User Profile image" },
    isVerifiedProfile: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: true, defaultValue: false, comment: "User Profile image" },
    comment: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "" },
    currentStatus: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: 0, comment: "" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "Status of user. 0-> Inactive, 1-> Active, 2-> not verified" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "seller_profile",
    indexes: []
});
exports.default = SellerProfile;
