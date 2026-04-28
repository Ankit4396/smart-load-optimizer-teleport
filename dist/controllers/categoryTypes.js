"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.list = exports.getAll = exports.deleteCategoryType = exports.update = exports.get = exports.create = void 0;
const models_1 = require("../models");
const Common = require("./common");
const Constants = require("../constants");
const Moment = require("moment");
const _ = require("lodash");
const dbImporter_1 = require("../config/dbImporter");
// Define all query attributes
const attributes = [
    'id', 'code', 'status', 'userId', 'isRevision', 'revisionId', 'createdAt', 'updatedAt',
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name'],
    [models_1.sequelize.literal('(case when `content`.description is not null then `content`.description else `defaultContent`.description END)'), 'description']
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
// Fetch a category type by identifier
const fetch = (id, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let categoryType = yield models_1.Models.CategoryType.findOne({
            attributes: attributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.CategoryTypeContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.CategoryTypeContent, as: 'defaultContent',
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
        return categoryType;
    }
    catch (error) {
        console.log(error);
    }
});
// Generate revision of category type prior to update and delete functions.
const storeRevision = (Object, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let revisonObject = JSON.parse(JSON.stringify(Object));
        let revisionId = revisonObject.id;
        revisonObject = _.omit(revisonObject, ['id']);
        revisonObject.isRevision = true;
        revisonObject.code = revisonObject.code + '-' + Moment().toISOString();
        revisonObject.revisionId = revisionId;
        for (const key in revisonObject.CategorytypeContents) {
            revisonObject.CategorytypeContents[key] = _.omit(revisonObject.CategorytypeContents[key], ['id', 'categorytypeId']);
        }
        let revision = yield models_1.Models.CategoryType.create(revisonObject, { include: [{ model: models_1.Models.CategoryTypeContent }], transaction: transaction });
        if (revision)
            return revision;
        else
            return false;
    }
    catch (err) {
        return false;
    }
});
// create a new category type
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { name, description } = request.payload;
        let exists = yield models_1.Models.CategoryType.findOne({
            include: [
                { model: models_1.Models.CategoryTypeContent, where: { name: name } }
            ]
        });
        if (!exists) {
            let userId = request.auth.credentials.userData.id;
            let slug = yield Common.slugify(name);
            let language = request.headers.language;
            let descriptionText = yield Common.convertHtmlToText(description);
            let defaultLanguageObject = {};
            let requestedLanguageObject = {};
            let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
            let CategorytypeContents = [];
            if (defaultLanguage) {
                if (language != process.env.DEFAULT_LANGUAGE_CODE) {
                    // create content in default language as user language is not default
                    let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.header.language } });
                    if (defaultLanguage && requestedLanguage) {
                        //create categoryType in default in requested language
                        defaultLanguageObject = {
                            name: name,
                            description: description,
                            descriptionText: descriptionText,
                            languageId: defaultLanguage.id
                        };
                        requestedLanguageObject = {
                            name: name,
                            description: description,
                            descriptionText: descriptionText,
                            languageId: requestedLanguage.id
                        };
                        CategorytypeContents.push(defaultLanguageObject, requestedLanguageObject);
                    }
                    else {
                        return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_CREATION', {});
                    }
                }
                else {
                    defaultLanguageObject = {
                        name: name,
                        description: description,
                        descriptionText: descriptionText,
                        languageId: defaultLanguage === null || defaultLanguage === void 0 ? void 0 : defaultLanguage.id
                    };
                    CategorytypeContents.push(defaultLanguageObject);
                }
                console.log(CategorytypeContents);
                let categoryType = yield models_1.Models.CategoryType.create({
                    code: slug,
                    userId: userId,
                    lastUpdatedBy: null,
                    status: Constants.STATUS.ACTIVE,
                    CategoryTypeContents: CategorytypeContents
                }, {
                    include: [
                        { model: models_1.Models.CategoryTypeContent }
                    ],
                    transaction: transaction
                });
                if (categoryType) {
                    yield transaction.commit();
                    let categoryTypeObj = JSON.parse(JSON.stringify(categoryType));
                    // returnOBj['name'] = returnOBj.CategorytypeContents[0].name;
                    // returnOBj['description'] = returnOBj.CategorytypeContents[0].description;
                    // returnOBj = _.omit(returnOBj, ['CategorytypeContents']);
                    let returnObject = yield fetch(categoryTypeObj.id, request.headers.language);
                    returnObject = JSON.parse(JSON.stringify(returnObject));
                    return h.response({ message: request.i18n.__("CATEGORY_TYPE_HAS_BEEN_CREATED_SUCCESSFULLY"), responseData: returnObject }).code(200);
                }
                else {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_CATEGORY_TYPE', {});
                }
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'CONTENT_TYPE_ALREADY_EXISTS_WITH_SAME_NAME', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'CATEGORY_ALREADY_EXISTS', {});
        }
    }
    catch (err) {
        console.log(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.create = create;
// get a category type by id
const get = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = request.params;
        let categorytype = yield fetch(id, request.headers.language);
        if (categorytype) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(categorytype)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'CATEGORY_TYPE_DOES_NOT_EXISTS', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.get = get;
// update a category type
const update = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let { name, description } = request.payload;
        let categorytype = yield models_1.Models.CategoryType.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.CategoryTypeContent
                }
            ]
        });
        if (categorytype) {
            // Create revision of existing entity in DB
            let revisonObject = JSON.parse(JSON.stringify(categorytype));
            let revision = yield storeRevision(revisonObject, transaction);
            let updateStamp = yield models_1.Models.CategoryType.update({ lastUpdatedBy: userId }, { where: { id: categorytype.id }, transaction: transaction });
            let requestedLanguageId = yield models_1.Models.Language.findOne({ where: { code: request.headers.language } });
            const existingContent = (_a = categorytype === null || categorytype === void 0 ? void 0 : categorytype.CategoryTypeContents) === null || _a === void 0 ? void 0 : _a.find((content) => content.languageId == (requestedLanguageId === null || requestedLanguageId === void 0 ? void 0 : requestedLanguageId.id));
            if (existingContent) {
                let updatedContent = { name: '', description: '', descriptionText: '', languageId: existingContent.languageId };
                updatedContent['name'] = name;
                updatedContent['description'] = description;
                updatedContent['descriptionText'] = yield Common.convertHtmlToText(description);
                yield models_1.Models.CategoryTypeContent.update(updatedContent, { where: { id: existingContent.id }, transaction: transaction });
            }
            else {
                let newContent = { name: '', description: '', descriptionText: '', languageId: existingContent.languageId };
                newContent.name = name;
                newContent.description = description;
                newContent.categorytypeId = categorytype.id;
                newContent.descriptionText = yield Common.convertHtmlToText(description);
                newContent.languageId = requestedLanguageId.id;
                yield models_1.Models.CategoryTypeContent.create(newContent, { transaction: transaction });
            }
            yield transaction.commit();
            let responseObject = yield fetch(id, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("CATEGORY_TYPE_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'CATEGORY_TYPE_ID_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.update = update;
// Delete a category type by identifier
const deleteCategoryType = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let categorytype = yield fetch(id, request.headers.language);
        if (categorytype) {
            if (categorytype.userId) {
                let userId = request.auth.credentials.userData.id;
                let revisonObject = JSON.parse(JSON.stringify(categorytype));
                let revision = yield storeRevision(revisonObject, transaction);
                if (revision) {
                    let updateStamp = yield models_1.Models.CategoryType.update({ lastUpdatedBy: userId }, { where: { id: categorytype.id }, transaction: transaction });
                    let removeCategory = yield categorytype.destroy({ transaction: transaction });
                    yield transaction.commit();
                    return h.response({ message: request.i18n.__("CATEGORY_TYPE_HAS_BEEN_DELETED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(categorytype)) }).code(200);
                }
                else {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'ERROR_WHILE_UPDATING_THE_REVISION', {});
                }
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'DEFAULT_CATEGORY_TYPES_CANNOT_BE_DELETED', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'CATEGORY_TYPE_ID_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deleteCategoryType = deleteCategoryType;
// Get all active category types
const getAll = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let categorytypes = yield models_1.Models.CategoryType.findAll({
            attributes: attributes,
            where: {
                status: Constants.STATUS.ACTIVE,
                isRevision: false
            },
            include: [
                {
                    attributes: [],
                    model: models_1.Models.CategoryTypeContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.CategoryTypeContent, as: 'defaultContent',
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
            ]
        });
        return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(categorytypes)) }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.getAll = getAll;
// List category types with pagination 
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page, searchText } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let where = { isRevision: false };
        if (searchText) {
            where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.or]: [
                    models_1.sequelize.literal('MATCH(`defaultContent`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                    models_1.sequelize.literal('MATCH(`content`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                ] });
        }
        let categorytypes = yield models_1.Models.CategoryType.findAndCountAll({
            attributes: attributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.CategoryTypeContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.CategoryTypeContent, as: 'defaultContent',
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
            order: [['id', 'desc']],
            where: where,
            offset: offset,
            limit: perPage,
            distinct: true,
            subQuery: false,
            replacements: { searchText }
        });
        const count = categorytypes.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(categorytypes.rows));
        return h.response({
            message: request.i18n.__("CATEGORY_TYPE_LIST_REQUEST_PROCESSED_SUCCESSFULLY"),
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
// update status of category type
const updateStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let { status } = request.payload;
        let categorytype = yield models_1.Models.CategoryType.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.CategoryTypeContent
                }
            ]
        });
        if (categorytype) {
            // Create revision of existing entity in DB
            let revisonObject = JSON.parse(JSON.stringify(categorytype));
            let revision = yield storeRevision(revisonObject, transaction);
            let updateStamp = yield models_1.Models.CategoryType.update({ lastUpdatedBy: userId, status: status }, { where: { id: categorytype.id }, transaction: transaction });
            yield transaction.commit();
            let responseObject = yield fetch(id, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("CATEGORY_TYPE_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'CATEGORY_TYPE_ID_NOT_FOUND', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateStatus = updateStatus;
