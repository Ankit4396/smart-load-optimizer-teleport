"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const SupportTicket = _1.sequelize.define("SupportTicket", {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "User ID who raised the ticket" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Account ID (optional if needed)" },
    subject: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: "Ticket subject" },
    message: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "User's message" },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        comment: "Ticket status: 0->Open, 1->In Progress, 2->Closed"
    }
}, {
    paranoid: true,
    underscored: true,
    tableName: "support_tickets",
    indexes: []
});
exports.default = SupportTicket;
