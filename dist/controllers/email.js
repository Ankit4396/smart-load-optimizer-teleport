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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.sendMail = exports.updateStatus = exports.getByCode = exports.get = exports.list = exports.deleteTemplate = exports.update = exports.create = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const moment_1 = __importDefault(require("moment"));
const Constants = __importStar(require("../constants"));
const _ = __importStar(require("lodash"));
const http_1 = require("http");
const attributes = [
    'id', 'code', 'status', 'userId', 'isRevision', 'revisionId', 'createdAt', 'updatedAt', 'replacements',
    [models_1.sequelize.literal('(case when `content`.title is not null then `content`.title else `defaultContent`.title END)'), 'title'],
    [models_1.sequelize.literal('(case when `content`.subject is not null then `content`.subject else `defaultContent`.subject END)'), 'subject'],
    [models_1.sequelize.literal('(case when `content`.`message` is not null then `content`.`message` else `defaultContent`.`message` END)'), 'message']
];
const authorAttributes = [
    'id',
    [models_1.sequelize.literal('`author->userProfile`.`name`'), 'name'],
    [models_1.sequelize.literal('`author->userProfile->profileAttachment`.`unique_name`'), 'profileImage']
];
const updatedByAttributes = [
    'id',
    [models_1.sequelize.literal('`updatedBy->userProfile`.`name`'), 'name'],
    [models_1.sequelize.literal('`updatedBy->userProfile->profileAttachment`.`unique_name`'), 'profileImage']
];
const storeRevision = (templateObject, userId, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log(templateObject);
        let revisionObject = Object.assign({}, templateObject);
        delete revisionObject.id;
        revisionObject.isRevision = true;
        revisionObject.code = revisionObject.code + '-' + (0, moment_1.default)().toISOString();
        revisionObject.revisionId = templateObject.id || 0;
        revisionObject.userId = userId;
        let contentLength = (_b = (_a = revisionObject === null || revisionObject === void 0 ? void 0 : revisionObject.EmailTemplateContents) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
        revisionObject.EmailTemplateContents = (_c = revisionObject === null || revisionObject === void 0 ? void 0 : revisionObject.EmailTemplateContents) === null || _c === void 0 ? void 0 : _c.filter(function (props) {
            delete props.id;
            delete props.EmailTemplateId;
            return props;
        });
        console.log(revisionObject, "================= obj");
        let revision = yield models_1.Models.EmailTemplate.create(revisionObject, { include: [{ model: models_1.Models.EmailTemplateContent }], transaction: transaction });
        console.log(revision, " ================ rev");
        if (revision)
            return revision;
        else
            return false;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
const fetch = (id, language) => __awaiter(void 0, void 0, void 0, function* () {
    let emailTemplate = yield models_1.Models.EmailTemplate.findOne({
        attributes: attributes,
        include: [
            {
                attributes: [],
                model: models_1.Models.EmailTemplateContent, as: 'content',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.EmailTemplateContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            },
            {
                model: models_1.Models.User,
                as: 'updatedBy',
                attributes: updatedByAttributes,
                include: [
                    {
                        model: models_1.Models.UserProfile,
                        as: "userProfile",
                        attributes: [],
                        include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                    }
                ]
            },
            {
                model: models_1.Models.User,
                as: 'author',
                attributes: authorAttributes,
                include: [
                    {
                        model: models_1.Models.UserProfile,
                        as: "userProfile",
                        attributes: [],
                        include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                    }
                ]
            }
        ],
        where: { id: id },
        subQuery: false,
    });
    return emailTemplate;
});
const fetchByCode = (code, language) => __awaiter(void 0, void 0, void 0, function* () {
    let emailTemplate = yield models_1.Models.EmailTemplate.findOne({
        attributes: attributes,
        include: [
            {
                attributes: [],
                model: models_1.Models.EmailTemplateContent, as: 'content',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.EmailTemplateContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            }
        ],
        where: { code: code },
        subQuery: false,
    });
    if (emailTemplate) {
        emailTemplate = JSON.parse(JSON.stringify(emailTemplate));
    }
    return emailTemplate;
});
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { code, title, subject, message, replacements } = request.payload;
        let messageText = yield Common.convertHtmlToText(message);
        let language = request.headers.language;
        let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
        let defaultLanguageObject = {};
        let requestedLanguageObject = {};
        let EmailTemplateContents = [];
        if (language != process.env.DEFAULT_LANGUAGE_CODE) {
            // create content in default language as user language is not default
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.headers.language } });
            if (defaultLanguage && requestedLanguage) {
                // create Email template in default in requested language
                defaultLanguageObject = {
                    title: title,
                    subject: subject,
                    message: message,
                    mesageText: messageText,
                    languageId: defaultLanguage.id
                };
                requestedLanguageObject = {
                    title: title,
                    subject: subject,
                    message: message,
                    mesageText: messageText,
                    languageId: requestedLanguage.id
                };
                EmailTemplateContents.push(defaultLanguageObject, requestedLanguageObject);
            }
            else {
                yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
                return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_CREATION', {});
            }
        }
        else {
            defaultLanguageObject = {
                title: title,
                subject: subject,
                message: message,
                messageText: messageText,
                languageId: defaultLanguage === null || defaultLanguage === void 0 ? void 0 : defaultLanguage.id
            };
            EmailTemplateContents.push(defaultLanguageObject);
        }
        let emailTemplate = yield models_1.Models.EmailTemplate.create({
            code: code,
            replacements: replacements,
            userId: userId,
            accountId: accountId,
            status: Constants.STATUS.ACTIVE,
            EmailTemplateContents: EmailTemplateContents
        }, {
            include: [{ model: models_1.Models.EmailTemplateContent }],
            transaction: transaction
        });
        if (emailTemplate) {
            yield (transaction === null || transaction === void 0 ? void 0 : transaction.commit());
            let returnOBj = JSON.parse(JSON.stringify(emailTemplate));
            returnOBj['title'] = returnOBj.EmailTemplateContents[0].title;
            returnOBj['subject'] = returnOBj.EmailTemplateContents[0].subject;
            returnOBj['message'] = returnOBj.EmailTemplateContents[0].message;
            returnOBj['messageText'] = returnOBj.EmailTemplateContents[0].messageText;
            returnOBj = _.omit(returnOBj, ['EmailTemplateContents']);
            return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: returnOBj }).code(200);
        }
        else {
            yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
            return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_EMAIL_TEMPLATE', {});
        }
    }
    catch (err) {
        console.log(err);
        yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.create = create;
const update = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { code, title, subject, message, replacements } = request.payload;
        let emailTemplate = yield models_1.Models.EmailTemplate.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.EmailTemplateContent
                }
            ]
        });
        if (emailTemplate) {
            emailTemplate = JSON.parse(JSON.stringify(emailTemplate));
            let revisonObject = JSON.parse(JSON.stringify(emailTemplate));
            let revision = yield storeRevision(revisonObject, userId, transaction);
            if (revision) {
                yield models_1.Models.EmailTemplate.update({ code: code, replacements: replacements }, { where: { id: emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.id } });
                let requestedLanguageId = yield models_1.Models.Language.findOne({ where: { code: request.headers.language } });
                if (requestedLanguageId) {
                    const existingContent = (_a = emailTemplate === null || emailTemplate === void 0 ? void 0 : emailTemplate.EmailTemplateContents) === null || _a === void 0 ? void 0 : _a.find((content) => content.languageId == (requestedLanguageId === null || requestedLanguageId === void 0 ? void 0 : requestedLanguageId.id));
                    if (existingContent) {
                        let updatedContent = {};
                        updatedContent['title'] = title;
                        updatedContent['subject'] = subject;
                        updatedContent['message'] = message;
                        updatedContent['messageText'] = yield Common.convertHtmlToText(message);
                        yield models_1.Models.EmailTemplateContent.update(updatedContent, { where: { id: existingContent.id }, transaction: transaction });
                    }
                    else {
                        let newContent = {};
                        newContent.title = title;
                        newContent.subject = subject;
                        newContent.message = message;
                        newContent.messageText = yield Common.convertHtmlToText(message);
                        newContent.languageId = requestedLanguageId.id;
                        yield models_1.Models.EmailTemplateContent.create(newContent, { transaction: transaction });
                    }
                    yield (transaction === null || transaction === void 0 ? void 0 : transaction.commit());
                    let responseObject = yield fetch(id, request.headers.language);
                    responseObject = JSON.parse(JSON.stringify(responseObject));
                    return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseObject }).code(200);
                }
                else {
                    yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
                    return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_UPDATION', {});
                }
            }
            else {
                yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_REVISION', {});
            }
        }
    }
    catch (err) {
        yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.update = update;
const deleteTemplate = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let { id } = request.params;
        let emailTemplate = yield models_1.Models.EmailTemplate.findOne({ where: { id: id }, include: [{ model: models_1.Models.EmailTemplateContent }] });
        if (emailTemplate) {
            let revisonObject = JSON.parse(JSON.stringify(emailTemplate));
            let revision = yield storeRevision(revisonObject, userId, transaction);
            if (revision) {
                emailTemplate.update({ code: emailTemplate.code + '-' + (0, moment_1.default)().toISOString() });
                yield emailTemplate.destroy({ transaction: transaction });
                yield (transaction === null || transaction === void 0 ? void 0 : transaction.commit());
                return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: revisonObject }).code(200);
            }
            else {
                yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_REVISION', {});
            }
        }
        else {
            yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
            return Common.generateError(request, 400, 'EMAIL_TEMPLATE_DOES_NOT_EXISTS', {});
        }
    }
    catch (err) {
        yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deleteTemplate = deleteTemplate;
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        // perPage = (process.env.PAGINATION_LIMIT ?? 10) < perPage ? (process.env.PAGINATION_LIMIT ?? 10) : perPage
        let offset = (page - 1) * perPage;
        let requestedLanguage = yield models_1.Models.Language.findOne({ where: { code: request.headers.language } });
        let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
        if (requestedLanguage && defaultLanguage) {
            let emailTemplates = yield models_1.Models.EmailTemplate.findAndCountAll({
                attributes: attributes,
                include: [
                    {
                        attributes: [],
                        model: models_1.Models.EmailTemplateContent, as: 'content',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                        ]
                    },
                    {
                        attributes: [],
                        model: models_1.Models.EmailTemplateContent, as: 'defaultContent',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                        ]
                    },
                    {
                        model: models_1.Models.User,
                        as: 'updatedBy',
                        attributes: updatedByAttributes,
                        include: [
                            {
                                model: models_1.Models.UserProfile,
                                as: "userProfile",
                                attributes: [],
                                include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                            }
                        ]
                    },
                    {
                        model: models_1.Models.User,
                        as: 'author',
                        attributes: authorAttributes,
                        include: [
                            {
                                model: models_1.Models.UserProfile,
                                as: "userProfile",
                                attributes: [],
                                include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                            }
                        ]
                    }
                ],
                where: { isRevision: false },
                offset: offset,
                limit: perPage,
                distinct: true,
                subQuery: false
            });
            return h.response({ responseData: { data: emailTemplates.rows, perPage: perPage, totalRecords: emailTemplates.count, page: page, totalPages: emailTemplates.count > 0 ? Math.ceil(emailTemplates.count / perPage) : 0 } }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_UPDATION', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.list = list;
const get = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = request.params;
        let emailTemplate = yield fetch(id, request.headers.language);
        if (emailTemplate) {
            return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: JSON.parse(JSON.stringify(emailTemplate)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'EMAIL_TEMPLATE_DOES_NOT_EXISTS', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.get = get;
const getByCode = (code, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let verifyCode = yield models_1.Models.EmailTemplate.findOne({ where: { code: code } });
        let verifyCodeId = verifyCode === null || verifyCode === void 0 ? void 0 : verifyCode.id;
        if (verifyCodeId) {
            let emailTemplate = yield fetch(verifyCodeId, language);
            if (emailTemplate) {
                return JSON.parse(JSON.stringify(emailTemplate));
            }
            else {
                return Common.generateError(http_1.request, 400, 'EMAIL_TEMPLATE_DOES_NOT_EXISTS', {});
            }
        }
        else {
            return false;
        }
    }
    catch (err) {
        return false;
    }
});
exports.getByCode = getByCode;
const updateStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let { userId } = request.auth.credentials.userData.id;
        let { status } = request.payload;
        let emailTemplate = yield models_1.Models.EmailTemplate.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.EmailTemplateContent
                }
            ]
        });
        if (emailTemplate) {
            // Create a revision of the existing entity in DB
            let revisonObject = JSON.parse(JSON.stringify(emailTemplate));
            let revision = yield storeRevision(revisonObject, userId, transaction);
            let updateStamp = yield models_1.Models.EmailTemplate.update({ lastUpdatedById: userId, status: status }, { where: { id: emailTemplate.id }, transaction: transaction });
            yield (transaction === null || transaction === void 0 ? void 0 : transaction.commit());
            let responseObject = yield fetch(id, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseObject }).code(200);
        }
        else {
            yield (transaction === null || transaction === void 0 ? void 0 : transaction.rollback());
            return Common.generateError(request, 400, 'EMAIL_TEMPLATE_DOES_NOT_EXISTS', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateStatus = updateStatus;
const sendMail = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    return true;
});
exports.sendMail = sendMail;
const sendEmail = (code, replacements, emails, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.NODE_ENV === "TEST") {
            return { success: true, message: "REQUEST_SUCCESSFULL", data: null };
        }
        // const data = await Common.sendEmail(emails, process.env.SES_SMTP_EMAIL!, [], [], code, replacements, [], language, 'email', 'signup');
        const data = yield Common.sendEmail(emails, 'mohitangaria77@gmail.com', [], [], code, replacements, [], language, 'email', 'signup');
        return { success: true, message: "REQUEST_SUCCESSFULL", data: null };
    }
    catch (error) {
        return { success: false, message: "ERROR_WHILE_SENDING_EMAIL", data: null };
    }
});
exports.sendEmail = sendEmail;
