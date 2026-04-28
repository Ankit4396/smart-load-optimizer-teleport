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
exports.deleteAttribute = exports.updateAttributeStatus = exports.updateAttribute = exports.attributeList = exports.getAttribute = exports.createAttribute = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const Constants = __importStar(require("../constants"));
const moment_1 = __importDefault(require("moment"));
const dbImporter_1 = require("../config/dbImporter");
const attributeAttributes = [
    'id', 'code', 'type', 'isVariant', 'status', 'createdAt', 'updatedAt',
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name'],
];
const attributeOptionAttributes = [
    'id', 'code', 'attributeId',
    [models_1.sequelize.literal('(case when `AttributeOptions->content`.name is not null then `AttributeOptions->content`.name else `AttributeOptions->defaultContent`.name END)'), 'name'],
];
const getAttributeOrderSequence = (Id, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    let orderSequence = '';
    let attributeId;
    attributeId = Id;
    let categoryAttributeCode = '';
    try {
        let loopcounter = 0;
        let attributeData;
        orderSequence = '';
        while (attributeId != null) {
            if (loopcounter != 0)
                orderSequence = orderSequence != '' ? categoryAttributeCode + '|' + orderSequence : categoryAttributeCode;
            attributeData = yield models_1.Models.Attribute.findOne({ attributes: ['id', 'code'], where: { id: attributeId }, transaction: transaction });
            categoryAttributeCode = attributeData === null || attributeData === void 0 ? void 0 : attributeData.code;
            attributeId = null;
            loopcounter += 1;
        }
        if (orderSequence != '')
            orderSequence = (attributeData === null || attributeData === void 0 ? void 0 : attributeData.code) + "|" + orderSequence;
        else
            orderSequence = attributeData === null || attributeData === void 0 ? void 0 : attributeData.code;
        return orderSequence;
    }
    catch (err) {
        return orderSequence;
    }
});
// fetch attribute details by id
const fetchAttribute = (id, accountId, language) => __awaiter(void 0, void 0, void 0, function* () {
    let attributeData = yield models_1.Models.Attribute.findOne({
        attributes: attributeAttributes,
        include: [
            {
                attributes: [],
                model: models_1.Models.AttributeContent, as: 'content',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.AttributeContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            },
            {
                attributes: attributeOptionAttributes,
                model: models_1.Models.AttributeOption,
                include: [
                    {
                        attributes: [],
                        model: models_1.Models.AttributeOptionContent, as: 'content',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: language } }
                        ]
                    },
                    {
                        attributes: [],
                        model: models_1.Models.AttributeOptionContent, as: 'defaultContent',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                        ]
                    },
                ]
            }
        ],
        where: { id: id, accountId: accountId },
        subQuery: false,
    });
    return attributeData;
});
const createAttribute = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { name, type, isVariant, options } = request.payload;
        let slug = yield Common.slugify(name);
        let AttributeContents = [];
        let attributeWhere = { accountId: accountId, code: slug };
        let existingCase = yield models_1.Models.Attribute.findOne({ where: attributeWhere });
        let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
        console.log(defaultLanguage, " =================== defaultLanguage");
        let language = request.headers.language;
        let defaultLanguageObject;
        let requestedLanguageObject;
        if (defaultLanguage) {
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.headers.language } });
            if (language != process.env.DEFAULT_LANGUAGE_CODE) {
                // create content in default language as user language is not default
                if (defaultLanguage && requestedLanguage) {
                    //create attribute in default in requested language
                    defaultLanguageObject = {
                        name: name,
                        languageId: defaultLanguage.id
                    };
                    requestedLanguageObject = {
                        name: name,
                        languageId: requestedLanguage.id
                    };
                    AttributeContents.push(defaultLanguageObject, requestedLanguageObject);
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
                AttributeContents.push(defaultLanguageObject);
            }
            if (!existingCase) {
                let attributeData = yield models_1.Models.Attribute.create({
                    code: slug,
                    userId: userId,
                    accountId: accountId,
                    lastUpdatedBy: null,
                    isVariant: isVariant,
                    type: type,
                    AttributeContents: AttributeContents
                }, {
                    include: [
                        { model: models_1.Models.AttributeContent }
                    ],
                    transaction: transaction
                });
                if (attributeData) {
                    let attributeId = attributeData === null || attributeData === void 0 ? void 0 : attributeData.id;
                    if (type == Constants.ATTRIBUTE_TYPE.DROPDOWN && options && options.length > 0) {
                        for (let [index, obj] of options.entries()) {
                            console.log(obj, 'kkkkkkkkk--');
                            let slug = Common.slugify(obj.name);
                            let record = yield models_1.Models.AttributeOption.findOne({ where: { attributeId: attributeId, code: slug } });
                            let defaultLanguageObject;
                            let requestedLanguageObject;
                            let AttributeOptionContents = [];
                            if (!record) {
                                if (language != process.env.DEFAULT_LANGUAGE_CODE) {
                                    // create content in default language as user language is not default
                                    if (defaultLanguage && requestedLanguage) {
                                        //create attribute in default in requested language
                                        defaultLanguageObject = {
                                            name: obj.name,
                                            languageId: defaultLanguage.id
                                        };
                                        requestedLanguageObject = {
                                            name: obj.name,
                                            languageId: requestedLanguage.id
                                        };
                                        AttributeOptionContents.push(defaultLanguageObject, requestedLanguageObject);
                                    }
                                    else {
                                        yield transaction.rollback();
                                        return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_CREATION', {});
                                    }
                                }
                                else {
                                    defaultLanguageObject = {
                                        name: obj.name,
                                        languageId: defaultLanguage === null || defaultLanguage === void 0 ? void 0 : defaultLanguage.id
                                    };
                                    AttributeOptionContents.push(defaultLanguageObject);
                                }
                                let categoryAttributeOption = yield models_1.Models.AttributeOption.create({
                                    code: slug,
                                    attributeId: attributeId,
                                    AttributeOptionContents: AttributeOptionContents
                                }, {
                                    include: [
                                        { model: models_1.Models.AttributeOptionContent }
                                    ],
                                    transaction: transaction
                                });
                            }
                        }
                    }
                    let orderSequence = yield getAttributeOrderSequence(attributeData.id, transaction);
                    yield models_1.Models.Attribute.update({ orderSequence: orderSequence }, { where: { id: attributeData.id }, transaction: transaction });
                    yield transaction.commit();
                    let returnObject = yield fetchAttribute(attributeData.id, accountId, request.headers.language);
                    returnObject = JSON.parse(JSON.stringify(returnObject));
                    return h.response({ message: request.i18n.__("ATTRIBUTE_CREATED_SUCCESSFULLY"), responseData: returnObject }).code(200);
                }
                else {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_ATTRIBUTE', {});
                }
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ATTRIBUTE_ALREADY_EXISTS', {});
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
exports.createAttribute = createAttribute;
// get a attribute by id
const getAttribute = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = request.params;
        let attributeId = id;
        let accountId = request.auth.credentials.userData.accountId;
        let attributeData = yield fetchAttribute(attributeId, accountId, request.headers.language);
        if (attributeData) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(attributeData)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'ATTRIBUTE_DOES_NOT_EXIST', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.getAttribute = getAttribute;
// List attributes without pagination 
const attributeList = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let language = request.headers.language;
        let records = yield models_1.Models.Attribute.findAll({
            attributes: attributeAttributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.AttributeContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.AttributeContent, as: 'defaultContent',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                },
                {
                    attributes: attributeOptionAttributes,
                    model: models_1.Models.AttributeOption,
                    include: [
                        {
                            attributes: [],
                            model: models_1.Models.AttributeOptionContent, as: 'content',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: language } }
                            ]
                        },
                        {
                            attributes: [],
                            model: models_1.Models.AttributeOptionContent, as: 'defaultContent',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                            ]
                        },
                    ]
                }
            ],
            where: { accountId: accountId },
            subQuery: false,
        });
        return h.response({
            message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: records
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.attributeList = attributeList;
//update attribute
const updateAttribute = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let attributeId = id;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { name, type, isVariant, options } = request.payload;
        let language = request.headers.language;
        let slug = yield Common.slugify(name);
        let attributeDetails = yield fetchAttribute(attributeId, accountId, language);
        if (!attributeDetails) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'VALID_ATTRIBUTE_IS_REQUIRED', {});
        }
        let attributeWhere = { accountId: accountId, code: slug, id: { [dbImporter_1.Op.ne]: attributeId } };
        let existingCase = yield models_1.Models.Attribute.findOne({ where: attributeWhere });
        if (attributeDetails && !existingCase) {
            yield models_1.Models.Attribute.update({
                type: type,
                isVariant: isVariant,
                code: slug
            }, { where: { id: attributeId }, transaction });
            //Check if request language content exists
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.headers.language } });
            if (requestedLanguage) {
                let requestLangContent = yield models_1.Models.AttributeContent.findOne({
                    where: {
                        attributeId: attributeId,
                        languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id
                    }
                });
                let updatedAttributeContentObj = {
                    attributeId: attributeId,
                    languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id,
                    name: name
                };
                if (requestLangContent) {
                    yield models_1.Models.AttributeContent.update(updatedAttributeContentObj, {
                        where: {
                            id: requestLangContent === null || requestLangContent === void 0 ? void 0 : requestLangContent.id,
                            languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id
                        },
                        transaction
                    });
                }
                else {
                    yield models_1.Models.AttributeContent.create(updatedAttributeContentObj, {
                        transaction
                    });
                }
                if (type == Constants.ATTRIBUTE_TYPE.DROPDOWN) {
                    if (options.length > 0) {
                        for (let [index, obj] of options.entries()) {
                            if (obj.id && obj.isDeleted) {
                                let optionInitialData = yield models_1.Models.AttributeOption.findOne({ where: { id: obj.id } });
                                if (optionInitialData) {
                                    let newSlug = (optionInitialData === null || optionInitialData === void 0 ? void 0 : optionInitialData.code) + "_" + (0, moment_1.default)().toISOString();
                                    yield models_1.Models.AttributeOption.update({ code: newSlug }, { where: { id: obj.id }, transaction });
                                    yield models_1.Models.AttributeOption.destroy({ where: { id: obj.id }, transaction });
                                }
                            }
                            else {
                                let optionId = null;
                                let slug = Common.slugify(obj.name);
                                if (obj.id) {
                                    optionId = obj.id;
                                    //check if its not in use already 
                                    let optionRecord = yield models_1.Models.AttributeOption.findOne({ where: { attributeId: attributeId, code: slug, id: { [dbImporter_1.Op.ne]: obj.id } } });
                                    if (!optionRecord) {
                                        yield models_1.Models.AttributeOption.update({
                                            code: slug,
                                        }, { where: { id: obj.id }, transaction });
                                    }
                                }
                                else {
                                    let optionRecord = yield models_1.Models.AttributeOption.findOne({ where: { attributeId: attributeId, code: slug } });
                                    if (!optionRecord) {
                                        let optionData = yield models_1.Models.AttributeOption.create({
                                            code: slug,
                                            attributeId: attributeId
                                        }, { transaction });
                                        if (optionData && (optionData === null || optionData === void 0 ? void 0 : optionData.id)) {
                                            optionId = optionData === null || optionData === void 0 ? void 0 : optionData.id;
                                        }
                                    }
                                }
                                if (optionId) {
                                    let requestLangContent = yield models_1.Models.AttributeOptionContent.findOne({
                                        where: {
                                            attributeOptionId: optionId,
                                            languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id
                                        }
                                    });
                                    let updatedAttributeContentObj = {
                                        attributeOptionId: optionId,
                                        languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id,
                                        name: obj.name
                                    };
                                    if (requestLangContent) {
                                        yield models_1.Models.AttributeOptionContent.update(updatedAttributeContentObj, {
                                            where: {
                                                id: optionId,
                                                languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id
                                            },
                                            transaction
                                        });
                                    }
                                    else {
                                        yield models_1.Models.AttributeOptionContent.create(updatedAttributeContentObj, {
                                            transaction
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            yield transaction.commit();
            let responseObject = yield fetchAttribute(attributeId, accountId, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("ATTRIBUTE_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ATTRIBUTE_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateAttribute = updateAttribute;
// update status of attribute status
const updateAttributeStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let attributeId = id;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { status } = request.payload;
        let attributeData = yield models_1.Models.Attribute.findOne({
            where: { id: attributeId },
            include: [
                {
                    model: models_1.Models.AttributeContent
                }
            ]
        });
        if (attributeData && (attributeData === null || attributeData === void 0 ? void 0 : attributeData.id)) {
            yield models_1.Models.Attribute.update({ lastUpdatedBy: userId, status: status }, { where: { id: attributeData.id }, transaction: transaction });
            yield transaction.commit();
            let responseObject = yield fetchAttribute(attributeData.id, accountId, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("ATTRIBUTE_STATUS_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ATTRIBUTE_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateAttributeStatus = updateAttributeStatus;
//delete attribute
const deleteAttribute = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let attributeId = id;
        let accountId = request.auth.credentials.userData.accountId;
        let attributeData = yield models_1.Models.Attribute.findOne({
            where: { id: attributeId },
            include: [
                {
                    model: models_1.Models.AttributeContent
                }
            ]
        });
        if (attributeData) {
            let newSlug = attributeData.code + "_" + (0, moment_1.default)().toISOString();
            yield models_1.Models.Attribute.update({ code: newSlug }, { where: { id: attributeId } });
            yield models_1.Models.Attribute.destroy({ where: { id: attributeId } });
            yield transaction.commit();
            return h.response({ message: request.i18n.__("ATTRIBUTE_HAS_BEEN_DELETED_SUCCESSFULLY"), responseData: null }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ATTRIBUTE_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deleteAttribute = deleteAttribute;
