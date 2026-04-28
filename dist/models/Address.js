"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Address = _1.sequelize.define("Address", {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, comment: "Unique identifier for the address record" },
    userId: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Reference ID for the associated user"
    },
    accountId: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "Optional reference ID for the associated account"
    },
    shopId: {
        type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "Optional reference ID for the associated shop"
    },
    mapAddress: {
        type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Google Maps address representation"
    },
    address: {
        type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Manually entered address"
    },
    city: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "City of the address"
    },
    state: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "State or region of the address"
    },
    zipCode: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "Postal or ZIP code"
    },
    country: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "Country of the address"
    },
    landmark: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "Notable landmark near the address"
    },
    latitude: {
        type: sequelize_1.DataTypes.DOUBLE, defaultValue: null, comment: "Latitude coordinate of the address location"
    },
    longitude: {
        type: sequelize_1.DataTypes.DOUBLE, defaultValue: null, comment: "Longitude coordinate of the address location"
    },
    geoLocation: {
        type: sequelize_1.DataTypes.GEOMETRY, defaultValue: null, comment: "Longitude coordinate of the address location"
    },
    addressLine1: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "First line of the address"
    },
    addressLine2: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "Second line of the address (optional)"
    },
    countryCode: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "International country code for the address"
    },
    phone: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "Contact phone number associated with the address"
    },
    name: {
        type: sequelize_1.DataTypes.STRING, defaultValue: null, comment: "Name of the person or entity associated with the address"
    },
    entityType: {
        type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Specifies the type of entity associated with the address (e.g., buyer, seller, store)"
    },
    addressType: {
        type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "Specifies whether the address is a pickup or return location"
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status flag indicating the address's availability (1 = active, 0 = inactive)"
    }
}, {
    paranoid: true,
    underscored: true,
    tableName: "addresses",
    indexes: []
});
exports.default = Address;
