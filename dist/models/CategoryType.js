"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
const CategoryType = _1.sequelize.define("CategoryType", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: 'category-type-code', comment: "unique code for categoryType created, generated from title" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor of the record" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    isRevision: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "If redord is revision?" },
    revisionId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "ref to entity, If its a revision" },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of CategoryType. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "categories_types",
    indexes: [
        { name: 'id-revision', fields: ['id', 'is_revision'] },
    ]
});
exports.default = CategoryType;
