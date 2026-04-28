"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const SupportMessage = _1.sequelize.define("Support", {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    supportTicketId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Ticket ID" },
    senderType: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Sender user type" },
    message: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Ticket message" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "support_messages",
    indexes: []
});
exports.default = SupportMessage;
