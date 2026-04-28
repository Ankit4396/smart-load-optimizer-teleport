"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const SavedEvents = _1.sequelize.define("SavedEvents", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "user id" },
    eventId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Event Id of the lost or found item" },
    name: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "Descriptionn of the item" },
    startDate: { type: sequelize_1.DataTypes.DATE, allowNull: true, comment: "Event start date" },
    eventMetaData: { type: sequelize_1.DataTypes.JSON, allowNull: true, defaultValue: null, comment: "" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "saved_events",
    indexes: [
        { name: 'id', fields: ['id'] },
        { name: 'user_id', fields: ['user_id'] },
        { name: 'event_id', fields: ['event_id'] },
        { name: 'event_name', fields: [{ name: 'name', length: 100 }] },
        { name: 'event_start_date', fields: ['start_date'] },
    ]
});
exports.default = SavedEvents;
