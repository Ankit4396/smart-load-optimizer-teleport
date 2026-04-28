"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const UserProfile = _1.sequelize.define("UserProfile", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'user-profile', comment: "User ref id" },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "User  name" },
    dob: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "DOB" },
    attachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "User Profile image" },
    referralCode: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Refferal code of the user" },
    generalNotifications: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment: 'notifications enable disable' },
    paymentNotifications: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment: 'notifications enable disable' },
    reminderNotifications: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment: 'notifications enable disable' }
}, {
    paranoid: true,
    underscored: true,
    tableName: "user_profiles",
    indexes: [
        { name: 'id', fields: ['id'] },
        { name: 'name', fields: ['name'] },
    ]
});
UserProfile.addHook('beforeCreate', (userProfile) => {
    userProfile.referralCode = `REF-${userProfile.userId}`;
});
exports.default = UserProfile;
