"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
;
const Faq = _1.sequelize.define("Faq", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    categoryId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "category of the faq" },
    accountId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Aurthor account identity" },
    userId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, comment: "User who have created the faq" },
    lastUpdatedBy: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, defaultValue: null, comment: "Last user who has updated the record" },
    isRevision: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: "If redord is revision?" },
    revisionId: { type: sequelize_1.DataTypes.INTEGER, defaultValue: null, comment: "ref to entity, If its a revision" },
    sortOrder: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, comment: "order number" },
    searchIndex: { type: sequelize_1.DataTypes.TEXT, allowNull: true, defaultValue: null },
    status: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 1, comment: "Status of Category. 0-> Inactive, 1-> Active" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "faqs",
    indexes: [
        { name: 'id', fields: ['id'] },
        { name: 'faqs_searchIndex', fields: ['search_index'], type: 'FULLTEXT' }
    ]
});
exports.default = Faq;
