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
exports.getTree = exports.myDirectories = exports.updateStatus = exports.list = exports.getCategories = exports.deleteCategory = exports.update = exports.get = exports.create = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const Constants = __importStar(require("../constants"));
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const dbImporter_1 = require("../config/dbImporter");
// Define all query attributes
const hirarchyAttributes = [
    'id', 'code', 'parentId',
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name']
];
const mydirectoryattributes = [
    'id',
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name'],
];
const attributes = [
    'id', 'code', 'status', 'isRevision', 'revisionId', 'createdAt', 'updatedAt', 'level',
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name'],
    [models_1.sequelize.literal(`(SELECT count(id) from categories where parent_id = Category.id and deleted_at is null and is_revision = 0)`), "childCategoryCount"]
];
const categoryImageAttributes = [
    "id",
    [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`categoryImage`.`unique_name`')), 'filePath']
];
const parentAttributes = [
    'id', 'code',
    [models_1.sequelize.literal('(case when `parent->content`.name is not null then `parent->content`.name else `parent->defaultContent`.name END)'), 'name'],
];
const categoryParentImageAttributes = [
    "id",
    [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`parent->categoryImage`.`unique_name`')), 'filePath']
];
const categoryTypeAttributes = [
    'id', 'code',
    [models_1.sequelize.literal('(case when `categorytype->content`.name is not null then `categorytype->content`.name else `categorytype->defaultContent`.name END)'), 'name']
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
const categoryAttributeAttributes = [
    'id', 'code', 'categoryId', 'type', 'isVariant', 'status', 'createdAt', 'updatedAt',
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name'],
];
const categoryAttributeOptionAttributes = [
    'id', 'code', 'categoryAttributeId',
    [models_1.sequelize.literal('(case when `CategoryAttributeOptions->content`.name is not null then `CategoryAttributeOptions->content`.name else `CategoryAttributeOptions->defaultContent`.name END)'), 'name'],
];
// get all parents
const getParentHirarchy = (parentId, language, userId, accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let parentHirarchy = [];
        let parent = yield models_1.Models.Category.findOne({
            attributes: hirarchyAttributes,
            where: { id: parentId },
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
        });
        let object = JSON.parse(JSON.stringify(parent));
        if (object.parentId) {
            parentHirarchy.push(object);
            let parentCategory = yield getParentHirarchy(object.parentId, language, null, null);
            parentHirarchy = parentCategory.concat(parentHirarchy);
            return parentHirarchy;
        }
        else {
            parentHirarchy.push(object);
            return parentHirarchy;
        }
    }
    catch (err) {
        console.log(err);
        return [];
    }
});
// Fetch a category by identifier
const storeRevision = (Object, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let revisonObject = JSON.parse(JSON.stringify(Object));
        let revisionId = revisonObject.id;
        revisonObject = lodash_1.default.omit(revisonObject, ['id']);
        revisonObject.isRevision = true;
        revisonObject.code = revisonObject.code + '-' + (0, moment_1.default)().toISOString();
        revisonObject.revisionId = revisionId;
        for (const key in revisonObject.CategoryContents) {
            revisonObject.CategoryContents[key] = lodash_1.default.omit(revisonObject.CategoryContents[key], ['id', 'categoryId']);
        }
        let revision = yield models_1.Models.Category.create(revisonObject, { include: [{ model: models_1.Models.CategoryContent }], transaction: transaction });
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
const include = (language) => {
    return [
        {
            attributes: categoryImageAttributes,
            model: models_1.Models.Attachment,
            as: "categoryImage"
        },
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
        },
        {
            attributes: parentAttributes,
            model: models_1.Models.Category,
            as: 'parent',
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
            attributes: categoryTypeAttributes,
            model: models_1.Models.CategoryType,
            as: 'categorytype',
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
    ];
};
// fetch category details by id
const fetch = (id, accountId, language) => __awaiter(void 0, void 0, void 0, function* () {
    let category = yield models_1.Models.Category.findOne({
        attributes: attributes,
        include: include(language),
        where: { id: id, accountId: accountId },
        subQuery: false,
    });
    return category;
});
// get order sequence of a category
const getOrderSequence = (Id, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    let orderSequence = '';
    let categoryId = Id;
    let categoryCode = '';
    try {
        let loopcounter = 0;
        let category;
        orderSequence = '';
        while (categoryId != null) {
            if (loopcounter != 0)
                orderSequence = orderSequence != '' ? categoryCode + '|' + orderSequence : categoryCode;
            category = yield models_1.Models.Category.findOne({ attributes: ['parentId', 'code'], where: { id: categoryId }, transaction: transaction });
            categoryCode = category === null || category === void 0 ? void 0 : category.code;
            categoryId = category === null || category === void 0 ? void 0 : category.parentId;
            loopcounter += 1;
        }
        if (orderSequence != '')
            orderSequence = (category === null || category === void 0 ? void 0 : category.code) + "|" + orderSequence;
        else
            orderSequence = category === null || category === void 0 ? void 0 : category.code;
        return orderSequence;
    }
    catch (err) {
        return orderSequence;
    }
});
const ifChildIsParent = (categoryId, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let children = yield models_1.Models.Category.findAll({ attributes: ['id'], where: { parentId: categoryId } });
        const isParentPresent = children.find((child) => child.id === parentId);
        if (isParentPresent) {
            return true;
        }
        else {
            for (let child of children) {
                let levelHasParent = yield ifChildIsParent(child.id, parentId);
                if (levelHasParent)
                    return true;
            }
            return false;
        }
    }
    catch (err) {
        return true;
    }
});
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { name, parentId, categoryTypeCode, imageId } = request.payload;
        let categorytypeDetails = yield models_1.Models.CategoryType.findOne({ where: { code: categoryTypeCode } });
        if (!categorytypeDetails) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'VALID_CATEGORY_TYPE_IS_REQUIRED', {});
        }
        let categorytypeId = categorytypeDetails === null || categorytypeDetails === void 0 ? void 0 : categorytypeDetails.id;
        let slug = yield Common.slugify(name);
        let scannedSlug = slug;
        if (categoryTypeCode == 'directory') {
            slug = userId + "_" + slug;
        }
        let CategoryContents = [];
        if (parentId) {
            let parentCategory = yield models_1.Models.Category.findOne({ where: { id: parentId } });
            if (!parentCategory) {
                yield transaction.rollback();
                return Common.generateError(request, 400, categoryTypeCode == 'directory' ? 'PARENT_DIRECTORY_DOES_NOT_EXISTS' : 'PARENT_CATEGORY_DOES_NOT_EXISTS', {});
            }
            else if (parentCategory && parentCategory.categorytypeId != categorytypeId) {
                yield transaction.rollback();
                return Common.generateError(request, 400, categoryTypeCode == 'directory' ? 'PARENT_AND_CHILD_TYPE_DOES_NOT_MATCH' : 'PARENT_AND_CHILD_CATEGORY_TYPE_DOES_NOT_MATCH', {});
            }
        }
        let categoryWhere = { categorytypeId: categorytypeId, parentId: parentId };
        if (process.env.SAAS_ENABLED) {
            categoryWhere = lodash_1.default.assign(categoryWhere, { accountId: accountId });
            categoryWhere = Object.assign(Object.assign({}, categoryWhere), {
                [dbImporter_1.Op.or]: [
                    { userId: null, code: scannedSlug },
                    { userId: userId, code: slug }
                ]
            });
        }
        else {
            categoryWhere = lodash_1.default.assign(categoryWhere, { userId: userId });
            categoryWhere = Object.assign(Object.assign({}, categoryWhere), {
                [dbImporter_1.Op.or]: [
                    { userId: null, code: scannedSlug },
                    { userId: userId, code: slug }
                ]
            });
        }
        let existingCase = yield models_1.Models.Category.findOne({ where: categoryWhere });
        let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
        console.log(defaultLanguage, " =================== defaultLanguage");
        let language = request.headers.language;
        let defaultLanguageObject;
        let requestedLanguageObject;
        if (defaultLanguage) {
            if (language != process.env.DEFAULT_LANGUAGE_CODE) {
                // create content in default language as user language is not default
                let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.headers.language } });
                if (defaultLanguage && requestedLanguage) {
                    //create category in default in requested language
                    defaultLanguageObject = {
                        name: name,
                        languageId: defaultLanguage.id
                    };
                    requestedLanguageObject = {
                        name: name,
                        languageId: requestedLanguage.id
                    };
                    CategoryContents.push(defaultLanguageObject, requestedLanguageObject);
                }
                else {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_CREATION', {});
                }
            }
            else {
                defaultLanguageObject = {
                    name: name,
                    languageId: defaultLanguage === null || defaultLanguage === void 0 ? void 0 : defaultLanguage.id
                };
                CategoryContents.push(defaultLanguageObject);
            }
            if (!existingCase) {
                let category = yield models_1.Models.Category.create({
                    code: slug,
                    parentId: parentId,
                    imageId: imageId,
                    userId: userId,
                    accountId: accountId,
                    lastUpdatedBy: null,
                    categorytypeId: categorytypeId,
                    CategoryContents: CategoryContents
                }, {
                    include: [
                        { model: models_1.Models.CategoryContent }
                    ],
                    transaction: transaction
                });
                if (category) {
                    let orderSequence = yield getOrderSequence(category.id, transaction);
                    let level = orderSequence.split('|').length;
                    yield models_1.Models.Category.update({ orderSequence: orderSequence, level: level }, { where: { id: category.id }, transaction: transaction });
                    yield transaction.commit();
                    let returnObject = yield fetch(category.id, accountId, request.headers.language);
                    returnObject = JSON.parse(JSON.stringify(returnObject));
                    return h.response({ message: request.i18n.__(categoryTypeCode == 'directory' ? "DIRECTORY_CREATED_SUCCESSFULLY" : "CATEGORY_CREATED_SUCCESSFULLY"), responseData: returnObject }).code(200);
                }
                else {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_CATEGORY', {});
                }
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, categoryTypeCode == 'directory' ? 'DIRECTORY_WITH_NAME_ALREADY_EXISTS' : 'CATEGORY_WITH_NAME_ALREADY_IN_USE', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'DEFAULT_LANGUAGE_NOT_FOUND', {});
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
        let accountId = request.auth.credentials.userData.accountId;
        let category = yield fetch(id, accountId, request.headers.language);
        if (category) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(category)) }).code(200);
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
// update a category 
const update = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { name, parentId, imageId, categoryTypeCode } = request.payload;
        let slug = yield Common.slugify(name);
        let scannedSlug = slug;
        if (categoryTypeCode == 'directory') {
            slug = userId + "_" + slug;
        }
        let categorytypeDetails = yield models_1.Models.CategoryType.findOne({ where: { code: categoryTypeCode } });
        if (!categorytypeDetails) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'VALID_CATEGORY_TYPE_IS_REQUIRED', {});
        }
        let categorytypeId = categorytypeDetails.id;
        let category = yield models_1.Models.Category.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.CategoryContent
                }
            ]
        });
        let categoryWhere = { categorytypeId: categorytypeId, parentId: parentId, id: { [dbImporter_1.Op.ne]: id } };
        if (process.env.SAAS_ENABLED) {
            categoryWhere = lodash_1.default.assign(categoryWhere, { accountId: accountId });
            categoryWhere = Object.assign(Object.assign({}, categoryWhere), {
                [dbImporter_1.Op.or]: [
                    { userId: null, code: scannedSlug },
                    { userId: userId, code: slug }
                ]
            });
        }
        else {
            categoryWhere = lodash_1.default.assign(categoryWhere, { userId: userId });
            categoryWhere = Object.assign(Object.assign({}, categoryWhere), {
                [dbImporter_1.Op.or]: [
                    { userId: null, code: scannedSlug },
                    { userId: userId, code: slug }
                ]
            });
        }
        let existingCase = yield models_1.Models.Category.findOne({ where: categoryWhere });
        if (category && !existingCase) {
            // Create revision of existing entity in DB
            if (parentId) {
                let parentIsChild = yield ifChildIsParent(category.id, parentId);
                if (parentIsChild) {
                    return Common.generateError(request, 400, 'CHILD_CATEGOTY_CANNOT_BE_ASSIGNED_AS_PARENT}', {});
                }
            }
            let revisonObject = JSON.parse(JSON.stringify(category));
            let revision = yield storeRevision(revisonObject, transaction);
            let updateStamp = yield models_1.Models.Category.update({ lastUpdatedBy: userId, parentId: parentId, imageId: imageId }, { where: { id: category.id }, transaction: transaction });
            let requestedLanguageId = yield models_1.Models.Language.findOne({ where: { code: request.headers.language } });
            let orderSequence = yield getOrderSequence(category.id, transaction);
            let level = orderSequence.split('_').length;
            let updateobj = { orderSequence: orderSequence, level: level };
            if (category.userId) {
                updateobj = Object.assign(Object.assign({}, updateobj), { code: slug });
            }
            yield models_1.Models.Category.update(updateobj, { where: { id: category.id }, transaction: transaction });
            const existingContent = category.CategoryContents.find((content) => content.languageId == requestedLanguageId.id);
            if (existingContent) {
                let updatedContent = { name: '', languageId: existingContent.languageId };
                updatedContent['name'] = name;
                yield models_1.Models.CategoryContent.update(updatedContent, { where: { id: existingContent.id }, transaction: transaction });
            }
            else {
                let newContent = { name: '', languageId: existingContent.languageId };
                newContent.name = name;
                newContent.categoryId = category.id;
                newContent.languageId != (requestedLanguageId === null || requestedLanguageId === void 0 ? void 0 : requestedLanguageId.id);
                yield models_1.Models.CategoryContent.create(newContent, { transaction: transaction });
            }
            yield transaction.commit();
            let responseObject = yield fetch(id, accountId, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("CATEGORY_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'CATEGORY_ID_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.update = update;
const deleteCategory = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let category = yield models_1.Models.Category.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.CategoryContent
                }
            ]
        });
        if (category) {
            const childCategory = yield models_1.Models.Category.findOne({ where: { parentId: id, isRevision: false } });
            if (childCategory) {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'NOT_ALLOWED_DUE_TO_CHILD_CATEGORIES', {});
            }
            if (category.userId) {
                let subFolders = yield models_1.Models.Category.findOne({ where: { parentId: category.id, isRevision: false } });
                let userId = request.auth.credentials.userData.id;
                let revisonObject = JSON.parse(JSON.stringify(category));
                let revision = yield storeRevision(revisonObject, transaction);
                if (revision) {
                    let catResponseObject = yield fetch(id, accountId, request.headers.language);
                    catResponseObject = JSON.parse(JSON.stringify(catResponseObject));
                    yield category.update({ lastUpdatedBy: userId, code: category.code + '-' + (0, moment_1.default)().toISOString() });
                    yield category.destroy({ transaction: transaction });
                    yield transaction.commit();
                    return h.response({ message: request.i18n.__("CATEGORY_HAS_BEEN_DELETED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(catResponseObject)) }).code(200);
                }
                else {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_REVISION', {});
                }
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'DEFAULT_CATEGORY_CANNOT_BE_DELETED', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'CATEGORY_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deleteCategory = deleteCategory;
const getCategories = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let accountId = null;
        // if (request.auth.isAuthenticated) {
        //     accountId = request.auth.credentials.userData.accountId;
        // }
        let { categoryTypeCode } = request.params;
        let categoryType = yield models_1.Models.CategoryType.findOne({ where: { code: categoryTypeCode } });
        if (categoryType) {
            let where = {
                status: Constants.STATUS.ACTIVE,
                categorytypeId: categoryType.id,
                isRevision: false
            };
            if (accountId)
                where = Object.assign(Object.assign({}, where), { accountId: accountId });
            let categories = yield models_1.Models.Category.findAll({
                attributes: attributes,
                where: where,
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
                order: [["orderSequence", "ASC"], ["code", "ASC"]]
            });
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(categories)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'CATEGORY_NOT_FOUND', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.getCategories = getCategories;
// List category with pagination 
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { perPage, page, parentId, type, searchText } = request.query;
        let categoryType = yield models_1.Models.CategoryType.findOne({ where: { code: type } });
        console.log(request.query);
        if (!categoryType) {
            return Common.generateError(request, 400, 'CATEGORY_TYPE_DOES_NOT_EXISTS', {});
        }
        let hirarchy = [];
        if (parentId) {
            hirarchy = yield getParentHirarchy(parentId, request.headers.language, userId, accountId);
        }
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let where = { isRevision: false, parentId: parentId, categorytypeId: categoryType.id };
        if (type == 'directory') {
            where = Object.assign(Object.assign({}, where), { userId: null });
        }
        if (searchText) {
            searchText = searchText.replace('@', '*');
            searchText = searchText.replace(' ', '*') + '*';
            where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.or]: [
                    models_1.sequelize.literal('MATCH(`defaultContent`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                    models_1.sequelize.literal('MATCH(`content`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                ] });
        }
        let categories = yield models_1.Models.Category.findAndCountAll({
            attributes: attributes,
            include: [
                {
                    attributes: categoryImageAttributes,
                    model: models_1.Models.Attachment,
                    as: "categoryImage"
                },
                {
                    attributes: parentAttributes,
                    model: models_1.Models.Category,
                    as: 'parent',
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
                    attributes: categoryTypeAttributes,
                    model: models_1.Models.CategoryType,
                    as: 'categorytype',
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
                        }
                    ]
                },
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
        const count = categories.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(categories.rows));
        return h.response({
            message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalRecords: count,
                totalPages: totalPages,
                parentHirarchy: hirarchy
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.list = list;
// update status of category
const updateStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { status } = request.payload;
        let category = yield models_1.Models.Category.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.CategoryContent
                }
            ]
        });
        if (category) {
            // Create revision of existing entity in DB
            let revisonObject = JSON.parse(JSON.stringify(category));
            let revision = yield storeRevision(revisonObject, transaction);
            if (revision) {
                yield models_1.Models.Category.update({ lastUpdatedBy: userId, status: status }, { where: { id: category.id }, transaction: transaction });
                yield transaction.commit();
                let responseObject = yield fetch(id, accountId, request.headers.language);
                responseObject = JSON.parse(JSON.stringify(responseObject));
                return h.response({ message: request.i18n.__("CATEGORY_STATUS_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_REVISION', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'CATEGORY_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateStatus = updateStatus;
const myDirectories = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { categoryTypeCode } = request.params;
        let categoryType = yield models_1.Models.CategoryType.findOne({ where: { code: categoryTypeCode } });
        let myDirectories = yield models_1.Models.Category.findAll({
            attributes: mydirectoryattributes,
            where: {
                status: Constants.STATUS.ACTIVE,
                accountId: accountId,
                categorytypeId: categoryType === null || categoryType === void 0 ? void 0 : categoryType.id,
                isRevision: false,
                [dbImporter_1.Op.or]: [
                    { userId: userId, accountId: accountId },
                    { userId: null, accountId: accountId }
                ]
            },
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
            ],
            order: [["orderSequence", "ASC"], ["code", "ASC"]]
        });
        return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(myDirectories)) }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.myDirectories = myDirectories;
const getCategoryTree = (categotyTypeId, parentId, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let tree = [];
        let parentFlag = "";
        let categories = yield models_1.Models.Category.findAll({
            attributes: attributes,
            include: include(language),
            where: {
                categorytypeId: categotyTypeId,
                parentId: parentId,
                status: Constants.STATUS.ACTIVE
            }
        });
        if (categories.length > 0) {
            for (let category of categories) {
                category = JSON.parse(JSON.stringify(category));
                if (category.name && category.id) {
                    console.log(JSON.parse(JSON.stringify(category)));
                    let categoryObject = {
                        id: category.id,
                        name: category.name,
                        code: category.code,
                        filePath: category.filePath ? category.filePath : null,
                        childCategories: []
                    };
                    let childTree = yield getCategoryTree(categotyTypeId, category.id, language);
                    categoryObject.childCategories = childTree;
                    tree.push(categoryObject);
                }
            }
            return tree;
        }
        else {
            return [];
        }
    }
    catch (err) {
        return [];
    }
});
// get a category type by id
const getTree = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { categoryTypeCode } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let categorytypeDetails = yield models_1.Models.CategoryType.findOne({ where: { code: categoryTypeCode } });
        if (!categorytypeDetails) {
            return Common.generateError(request, 400, 'VALID_CATEGORY_TYPE_IS_REQUIRED', {});
        }
        const responseData = yield getCategoryTree(categorytypeDetails.id, null, request.headers.language);
        if (responseData) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(responseData)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'CATEGORY_TYPE_DOES_NOT_EXISTS', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.getTree = getTree;
