"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const sequelize_1 = require("sequelize");
;
const FaqContent = _1.sequelize.define("FaqContent", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    faqId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'unique-faq', comment: "Ref to faq table" },
    languageId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: 'unique-faq', comment: "language for which content has been created" },
    question: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Question" },
    questionText: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Question" },
    answer: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Answer to the question" },
    answerText: { type: sequelize_1.DataTypes.TEXT, allowNull: false, comment: "Answer to the question" }
}, {
    paranoid: true,
    underscored: true,
    tableName: "faqs_content",
    indexes: [
        { name: 'id', fields: ['id'] }
    ]
});
exports.default = FaqContent;
