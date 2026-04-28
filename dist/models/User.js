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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Constants = __importStar(require("../constants"));
const User = _1.sequelize.define("User", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: 'email',
        set(value) {
            // convert email to lowercase before saving
            this.setDataValue('email', value.toLowerCase());
        },
        comment: "User's Email id"
    },
    username: {
        type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "User's Email id"
    },
    countryCode: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "Country code", unique: "unique_mobile_per_country" },
    mobile: { type: sequelize_1.DataTypes.STRING, allowNull: true, comment: "User's mobile no", unique: "unique_mobile_per_country" },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        set(value) {
            // Encrypt the password before saving
            if (value) {
                const rounds = parseInt(process.env.HASH_ROUNDS);
                const hash = bcrypt_1.default.hashSync(value, rounds);
                this.setDataValue('password', hash);
            }
        },
        comment: "Encrypted user password"
    },
    googleLogin: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "User's mobile no" },
    facebookLogin: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "User's mobile no" },
    searchIndex: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: Constants.USER_STATUS.ACTIVE, comment: "Status of user. 0-> Inactive, 1-> Active, 2-> not verified" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "users",
    indexes: [
        { name: 'id', fields: ['id'] },
        { name: 'email', fields: ['email'] },
        { name: 'users_searchIndex', fields: ['search_index'], type: 'FULLTEXT' },
        { name: 'unique_mobile_per_country', unique: true, fields: ['country_code', 'mobile'] }
    ]
});
exports.default = User;
