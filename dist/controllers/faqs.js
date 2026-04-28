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
exports.listAll = exports.updateStatus = exports.setOrder = exports.publicList = exports.list = exports.deleteFaq = exports.update = exports.get = exports.create = void 0;
const models_1 = require("../models");
const dbImporter_1 = require("../config/dbImporter");
const Common = __importStar(require("./common"));
const moment_1 = __importDefault(require("moment"));
const Constants = __importStar(require("../constants"));
const routeImporter_1 = require("../config/routeImporter");
const attributes = [
    'id', 'status', 'isRevision', 'revisionId', 'createdAt', 'updatedAt', 'categoryId',
    [models_1.sequelize.literal('(case when `content`.question is not null then `content`.question else `defaultContent`.question END)'), 'question'],
    [models_1.sequelize.literal('(case when `content`.answer is not null then `content`.answer else `defaultContent`.answer END)'), 'answer'],
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
const categoryAttributes = [
    'id', 'code',
    [models_1.sequelize.literal('(case when `category->content`.name is not null then `category->content`.name else `category->defaultContent`.name END)'), 'name'],
];
const createSearchIndex = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let searchString = "";
    const faqInfo = yield models_1.Models.Faq.findOne({ where: { id: id } });
    if (faqInfo) {
        const content = yield models_1.Models.FaqContent.findAll({ where: { faqId: id } });
        for (let item of JSON.parse(JSON.stringify(content))) {
            searchString += item.question + " ";
            searchString += item.answer + " ";
        }
        if (searchString && searchString !== "") {
            yield faqInfo.update({ searchIndex: searchString });
        }
        return true;
    }
    return false;
});
// Fetch a category by identifier
const storeRevision = (Object, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let revisonObject = JSON.parse(JSON.stringify(Object));
        let revisionId = revisonObject.id;
        revisonObject = routeImporter_1._.omit(revisonObject, ['id']);
        revisonObject.isRevision = true;
        revisonObject.code = revisonObject.code + '-' + (0, moment_1.default)().toISOString();
        revisonObject.revisionId = revisionId;
        for (const key in revisonObject.FaqContents) {
            revisonObject.FaqContents[key] = routeImporter_1._.omit(revisonObject.FaqContents[key], ['id', 'faqId']);
        }
        let revision = yield models_1.Models.Faq.create(revisonObject, { include: [{ model: models_1.Models.FaqContent }], transaction: transaction });
        if (revision)
            return revision;
        else
            return false;
    }
    catch (err) {
        return false;
    }
});
// fetch category details by id
const fetch = (id, accountId, language) => __awaiter(void 0, void 0, void 0, function* () {
    let faq = yield models_1.Models.Faq.findOne({
        attributes: attributes,
        include: [
            {
                attributes: [],
                model: models_1.Models.FaqContent, as: 'content',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.FaqContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            },
            {
                attributes: categoryAttributes,
                model: models_1.Models.Category,
                as: 'category',
                include: [
                    {
                        attributes: [],
                        model: models_1.Models.CategoryContent, as: 'content',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: language } }
                        ]
                    },
                    {
                        attributes: [],
                        model: models_1.Models.CategoryContent, as: 'defaultContent',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                        ]
                    }
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
        // where:{id:id,accountId:accountId},
        subQuery: false,
    });
    return faq;
});
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { question, answer, categoryId } = request.payload;
        let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
        let language = request.headers.language;
        let questionText = yield Common.convertHtmlToText(question);
        let answerText = yield Common.convertHtmlToText(answer);
        let FaqContents = [];
        let defaultLanguageObject;
        let requestedLanguageObject;
        if (categoryId !== null) {
            const categoryInfo = yield models_1.Models.Category.findOne({ where: { id: categoryId } });
            if (!categoryInfo) {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'INVALID_CATEGORY_ID_PROVIDED', {});
            }
        }
        if (language != process.env.DEFAULT_LANGUAGE_CODE) {
            // create content in default language as user language is not default
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.header.language } });
            if (defaultLanguage && requestedLanguage) {
                //create category in default in requested language
                defaultLanguageObject = {
                    question: question,
                    answer: answer,
                    questionText: questionText,
                    answerText: answerText,
                    languageId: defaultLanguage.id
                };
                requestedLanguageObject = {
                    question: question,
                    answer: answer,
                    questionText: questionText,
                    answerText: answerText,
                    languageId: requestedLanguage.id
                };
                FaqContents.push(defaultLanguageObject, requestedLanguageObject);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_CREATION', {});
            }
        }
        else {
            defaultLanguageObject = {
                question: question,
                answer: answer,
                questionText: questionText,
                answerText: answerText,
                languageId: defaultLanguage.id
            };
            FaqContents.push(defaultLanguageObject);
        }
        let faq = yield models_1.Models.Faq.create({
            userId: userId,
            accountId: accountId,
            lastUpdatedBy: null,
            FaqContents: FaqContents,
            categoryId: categoryId
        }, {
            include: [
                { model: models_1.Models.FaqContent }
            ],
            transaction: transaction
        });
        if (faq) {
            yield models_1.Models.Faq.update({ sortOrder: faq.id }, { where: { id: faq.id }, transaction: transaction });
            yield transaction.commit();
            yield createSearchIndex(faq.id);
            let returnObject = yield fetch(faq.id, accountId, request.headers.language);
            returnObject = JSON.parse(JSON.stringify(returnObject));
            return h.response({ message: request.i18n.__("FAQ_CREATED_SUCCESSFULLY"), responseData: returnObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_FAQ', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.create = create;
// get a faq type by id
const get = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let faq = yield fetch(id, accountId, request.headers.language);
        if (faq) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(faq)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'FAQ_NOT_FOUND', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.get = get;
// update a faq 
const update = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { question, answer, categoryId } = request.payload;
        let questionText = yield Common.convertHtmlToText(question);
        let answerText = yield Common.convertHtmlToText(answer);
        let faq = yield models_1.Models.Faq.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.FaqContent
                }
            ]
        });
        if (faq) {
            if (categoryId !== null) {
                const categoryInfo = yield models_1.Models.Category.findOne({ where: { id: categoryId } });
                if (!categoryInfo) {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'INVALID_CATEGORY_ID_PROVIDED', {});
                }
            }
            // Create revision of existing entity in DB
            let revisonObject = JSON.parse(JSON.stringify(faq));
            let revision = yield storeRevision(revisonObject, transaction);
            let updateStamp = yield models_1.Models.Faq.update({ lastUpdatedBy: userId, categoryId }, { where: { id: faq.id }, transaction: transaction });
            let requestedLanguageId = yield models_1.Models.Language.findOne({ where: { code: request.headers.language } });
            const existingContent = faq.FaqContents.find((content) => content.languageId == (requestedLanguageId === null || requestedLanguageId === void 0 ? void 0 : requestedLanguageId.id));
            if (existingContent) {
                let updatedContent = {};
                updatedContent['question'] = question;
                updatedContent['answer'] = answer;
                updatedContent['questionText'] = questionText;
                updatedContent['answerText'] = answerText;
                yield models_1.Models.FaqContent.update(updatedContent, { where: { id: existingContent.id }, transaction: transaction });
            }
            else {
                let newContent = {};
                newContent.question = question;
                newContent.questionText = questionText;
                newContent.answer = answer;
                newContent.answerText = answerText;
                newContent.faqId = faq.id;
                newContent.languageId = requestedLanguageId === null || requestedLanguageId === void 0 ? void 0 : requestedLanguageId.id;
                yield models_1.Models.FaqContent.create(newContent, { transaction: transaction });
            }
            yield transaction.commit();
            yield createSearchIndex(id);
            let responseObject = yield fetch(id, accountId, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("FAQ_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'FAQ_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.update = update;
const deleteFaq = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let faq = yield models_1.Models.Faq.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [{ model: models_1.Models.FaqContent }]
        });
        if (faq) {
            let userId = request.auth.credentials.userData.id;
            let revisonObject = JSON.parse(JSON.stringify(faq));
            let revision = yield storeRevision(revisonObject, transaction);
            if (revision) {
                let faqResponseObject = yield fetch(id, accountId, request.headers.language);
                faqResponseObject = JSON.parse(JSON.stringify(faqResponseObject));
                yield faq.update({ lastUpdatedBy: userId });
                yield faq.destroy({ transaction: transaction });
                yield transaction.commit();
                return h.response({ message: request.i18n.__("FAQ_HAS_BEEN_DELETED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(faqResponseObject)) }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_REVISION', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'FAQ_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deleteFaq = deleteFaq;
// List faq with pagination  
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page, searchText, categoryId } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let language = request.headers.language;
        let where = { isRevision: false };
        if (categoryId !== null)
            [
                where = Object.assign(Object.assign({}, where), { categoryId: categoryId })
            ];
        let faqs = yield models_1.Models.Faq.findAndCountAll({
            attributes: attributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.FaqContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.FaqContent, as: 'defaultContent',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                },
                {
                    attributes: categoryAttributes,
                    model: models_1.Models.Category,
                    as: 'category',
                    include: [
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'content',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                            ]
                        },
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'defaultContent',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                            ]
                        }
                    ]
                },
                {
                    model: models_1.Models.User,
                    as: 'updatedBy',
                    attributes: updatedByAttributes,
                    include: [
                        {
                            model: models_1.Models.UserProfile,
                            attributes: [],
                            as: "userProfile",
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
                            attributes: [],
                            as: "userProfile",
                            include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                        }
                    ]
                }
            ],
            order: [['sortOrder', 'ASC']],
            where: where,
            offset: offset,
            limit: perPage,
            subQuery: false
        });
        const count = faqs.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(faqs.rows));
        return h.response({
            message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalPages: totalPages,
                totalRecords: count,
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.list = list;
const publicList = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page, searchText, categoryId } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let language = request.headers.language;
        let where = { isRevision: false, status: Constants.STATUS.ACTIVE };
        if (categoryId !== null)
            [
                where = Object.assign(Object.assign({}, where), { categoryId: categoryId })
            ];
        if (searchText) {
            searchText = searchText.replace('@', '*');
            searchText = searchText.replace(' ', '*') + '*';
            where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.or]: [
                    models_1.sequelize.literal('MATCH(`Faq`.search_index) AGAINST(:searchText IN BOOLEAN MODE)'),
                ] });
        }
        let faqs = yield models_1.Models.Faq.findAndCountAll({
            attributes: attributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.FaqContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.FaqContent, as: 'defaultContent',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                },
                {
                    attributes: categoryAttributes,
                    model: models_1.Models.Category,
                    as: 'category',
                    include: [
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'content',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                            ]
                        },
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'defaultContent',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                            ]
                        }
                    ]
                },
                {
                    model: models_1.Models.User,
                    as: 'updatedBy',
                    attributes: updatedByAttributes,
                    include: [
                        {
                            model: models_1.Models.UserProfile,
                            attributes: [],
                            as: "userProfile",
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
                            attributes: [],
                            as: "userProfile",
                            include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                        }
                    ]
                }
            ],
            order: [['sortOrder', 'ASC']],
            where: where,
            offset: offset,
            limit: perPage,
            subQuery: false,
            replacements: { searchText },
        });
        const count = faqs.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(faqs.rows));
        return h.response({
            message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalPages: totalPages,
                totalRecords: count,
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.publicList = publicList;
const setOrder = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { id } = request.params;
        let { sortOrder } = request.payload;
        let faq = yield models_1.Models.Faq.findOne({ where: { id: id } });
        if (faq) {
            let currentOrderValue = faq.sortOrder;
            if (sortOrder <= currentOrderValue) {
                yield models_1.Models.Faq.increment('sortOrder', { by: 1, where: { [dbImporter_1.Op.and]: [{ sortOrder: { [dbImporter_1.Op.gte]: sortOrder } }, { sortOrder: { [dbImporter_1.Op.lt]: currentOrderValue } }] }, transaction: transaction });
                yield models_1.Models.Faq.update({ sortOrder: sortOrder }, { where: { id: id }, transaction: transaction });
            }
            else if (sortOrder > currentOrderValue) {
                yield models_1.Models.Faq.decrement('sortOrder', { by: 1, where: { [dbImporter_1.Op.and]: [{ sortOrder: { [dbImporter_1.Op.gt]: currentOrderValue } }, { sortOrder: { [dbImporter_1.Op.lte]: sortOrder } }] }, transaction: transaction });
                yield models_1.Models.Faq.update({ sortOrder: sortOrder }, { where: { id: id }, transaction: transaction });
            }
            yield transaction.commit();
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY") }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'FAQ_NOT_FOUND', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.setOrder = setOrder;
// update status of category
const updateStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { status } = request.payload;
        let faq = yield models_1.Models.Faq.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.FaqContent
                }
            ]
        });
        if (faq) {
            // Create revision of existing entity in DB
            let revisonObject = JSON.parse(JSON.stringify(faq));
            let revision = yield storeRevision(revisonObject, transaction);
            if (revision) {
                yield models_1.Models.Faq.update({ lastUpdatedBy: userId, status: status }, { where: { id: faq.id }, transaction: transaction });
                yield transaction.commit();
                let responseObject = yield fetch(id, accountId, request.headers.language);
                responseObject = JSON.parse(JSON.stringify(responseObject));
                return h.response({ message: request.i18n.__("FAQ_STATUS_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_REVISION', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'FAQ_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateStatus = updateStatus;
const listAll = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let language = request.headers.language;
        let where = { status: Constants.STATUS.ACTIVE, isRevision: false };
        if (request.query.categoryId !== null)
            [
                where = Object.assign(Object.assign({}, where), { categoryId: request.query.categoryId })
            ];
        let faqs = yield models_1.Models.Faq.findAll({
            attributes: attributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.FaqContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.FaqContent, as: 'defaultContent',
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
                            attributes: [],
                            as: "userProfile",
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
                            attributes: [],
                            as: "userProfile",
                            include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                        }
                    ]
                }
            ],
            where: where,
            order: [['sortOrder', 'ASC']]
        });
        let responseObject = JSON.parse(JSON.stringify(faqs));
        return h.response({
            message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: responseObject
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.listAll = listAll;
