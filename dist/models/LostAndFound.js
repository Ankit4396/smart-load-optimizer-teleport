"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const Constants = __importStar(require("../constants"));
const LostAndFound = _1.sequelize.define("LostAndFound", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: "Lost | Found"
    },
    itemName: { type: sequelize_1.DataTypes.STRING, allowNull: false, comment: 'Item Name' },
    lostOrFoundDate: { type: sequelize_1.DataTypes.DATE, allowNull: false, comment: "Lost or found Date" },
    bookingId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "Booking Id of the lost or found item" },
    eventId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Event Id of the lost or found item" },
    slot: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "Slot of the event" },
    attachmentId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Attachment Id of lost or found item" },
    ownerFound: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "Owner Found" },
    state: { type: sequelize_1.DataTypes.INTEGER, defaultValue: Constants.USER_STATUS.ACTIVE, comment: "State of ticket INTIATED|FOUND OWNER|DELEIVERED TO OWNER|OWNER NOT FOUND" },
    itemBelongsTo: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, allowNull: true, comment: "item belong to whom" },
    proofOfOwner: { type: sequelize_1.DataTypes.STRING, defaultValue: null, allowNull: true, comment: "proof of owner" },
    comment: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "Remark or comment if needed by admin" },
    reportedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "Reported By whom" },
    itemDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null, comment: "Descriptionn of the item" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: Constants.USER_STATUS.ACTIVE, comment: "Status of user. 0-> Inactive, 1-> Active, 2-> not verified" },
    contactCountryCode: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
    contactNumber: { type: sequelize_1.DataTypes.STRING, allowNull: true, defaultValue: null, comment: "" },
}, {
    paranoid: true,
    underscored: true,
    tableName: "lost_and_founds",
    indexes: [
        { name: 'id', fields: ['id'] },
        { name: 'reported_by', fields: ['reported_by'] },
        { name: 'event_id', fields: ['event_id'] },
        { name: 'booking_id', fields: ['booking_id'] },
        { name: 'item_name', fields: ['item_name'] },
    ]
});
exports.default = LostAndFound;
