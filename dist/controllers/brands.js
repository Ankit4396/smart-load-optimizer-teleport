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
exports.deleteBrand = exports.updateStatus = exports.getBrand = exports.list = exports.update = exports.create = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const moment_1 = __importDefault(require("moment"));
const dbImporter_1 = require("../config/dbImporter");
const brandAttributes = [
    'id', 'code', 'status', 'createdAt', 'updatedAt',
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name'],
];
const brandImageAttributes = [
    "id",
    [models_1.sequelize.fn('CONCAT', process.env.PROTOCOL, '://', process.env.API_SERVER_HOST, "/attachment/", models_1.sequelize.literal('`brandImage`.`unique_name`')), 'filePath']
];
// fetch brand details by id
const fetch = (id, accountId, language) => __awaiter(void 0, void 0, void 0, function* () {
    let brand = yield models_1.Models.Brand.findOne({
        attributes: brandAttributes,
        include: [
            {
                attributes: [],
                model: models_1.Models.BrandContent, as: 'content',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.BrandContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            },
            {
                attributes: brandImageAttributes,
                model: models_1.Models.Attachment,
                as: "brandImage"
            },
        ],
        where: { id: id, accountId: accountId },
        subQuery: false,
    });
    return brand;
});
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { name, attachmentId } = request.payload;
        let slug = yield Common.slugify(name);
        let BrandContents = [];
        let existingCase = yield models_1.Models.Attribute.findOne({ where: { code: slug } });
        let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
        let language = request.headers.language;
        let defaultLanguageObject;
        let requestedLanguageObject;
        if (defaultLanguage) {
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.headers.language } });
            if (language != process.env.DEFAULT_LANGUAGE_CODE) {
                if (defaultLanguage && requestedLanguage) {
                    defaultLanguageObject = {
                        name: name,
                        languageId: defaultLanguage.id
                    };
                    requestedLanguageObject = {
                        name: name,
                        languageId: requestedLanguage.id
                    };
                    BrandContents.push(defaultLanguageObject, requestedLanguageObject);
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
                BrandContents.push(defaultLanguageObject);
            }
            if (!existingCase) {
                let brand = yield models_1.Models.Brand.create({
                    code: slug,
                    userId: userId,
                    attachmentId: attachmentId || null,
                    accountId: accountId,
                    lastUpdatedBy: null,
                    BrandContents: BrandContents
                }, {
                    include: [
                        { model: models_1.Models.BrandContent }
                    ],
                    transaction: transaction
                });
                if (brand && brand.id) {
                    yield transaction.commit();
                    let brandData = fetch(brand === null || brand === void 0 ? void 0 : brand.id, accountId, language);
                    brandData = JSON.parse(JSON.stringify(brandData));
                    return h.response({ message: request.i18n.__("BRAND_CREATED_SUCCESSFULLY"), responseData: brandData }).code(200);
                }
                else {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_BRAND', {});
                }
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'BRAND_ALREADY_EXISTS', {});
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
const update = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let brandId = request.params.id;
        let { name, attachmentId } = request.payload;
        let slug = yield Common.slugify(name);
        let language = request.headers.language;
        let existingCase = yield models_1.Models.Brand.findOne({ where: { code: slug, id: { [dbImporter_1.Op.ne]: brandId } } });
        if (!existingCase) {
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.headers.language } });
            if (requestedLanguage) {
                let data = {
                    code: slug,
                    attachmentId: attachmentId || null,
                    lastUpdatedBy: userId
                };
                yield models_1.Models.Brand.update(data, {
                    where: {
                        id: brandId
                    },
                    transaction
                });
                let dataForLang = {
                    name: name,
                    languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id,
                    brandId: brandId
                };
                //check if data exists in requested lang
                let langData = yield models_1.Models.BrandContent.findOne({
                    where: {
                        languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id,
                        brandId: brandId
                    }
                });
                if (langData) {
                    yield models_1.Models.BrandContent.update(dataForLang, { where: { brandId: brandId, languageId: requestedLanguage === null || requestedLanguage === void 0 ? void 0 : requestedLanguage.id }, transaction });
                }
                else {
                    yield models_1.Models.BrandContent.create(dataForLang, { transaction });
                }
                yield transaction.commit();
                let brandData = fetch(brandId, accountId, language);
                brandData = JSON.parse(JSON.stringify(brandData));
                return h.response({ message: request.i18n.__("BRAND_UPDATED_SUCCESSFULLY"), responseData: brandData }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'REQUESTED_LANGUAGE_NOT_FOUND', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'BRAND_ALREADY_EXISTS', {});
        }
    }
    catch (err) {
        console.log(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.update = update;
// List category attributes with pagination 
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let language = request.headers.language;
        let { perPage, page, parentId, type, searchText } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let where = {};
        if (searchText) {
            where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.or]: [
                    models_1.sequelize.literal('MATCH(`defaultContent`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                    models_1.sequelize.literal('MATCH(`content`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                ] });
        }
        let records = yield models_1.Models.Brand.findAndCountAll({
            attributes: brandAttributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.BrandContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.BrandContent, as: 'defaultContent',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                },
                {
                    attributes: brandImageAttributes,
                    model: models_1.Models.Attachment,
                    as: "brandImage"
                }
            ],
            order: [['id', 'desc']],
            where: where,
            offset: offset,
            limit: perPage,
            subQuery: false,
            replacements: { searchText }
        });
        const count = records.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(records.rows));
        return h.response({
            message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalRecords: count,
                totalPages: totalPages,
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.list = list;
// get a brand by id
const getBrand = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let brand = yield fetch(id, accountId, request.headers.language);
        if (brand) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(brand)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'BRAND_DOES_NOT_EXIST', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.getBrand = getBrand;
// update status of brand
const updateStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { status } = request.payload;
        let brand = yield models_1.Models.Brand.findOne({
            where: { id: id },
            include: [
                {
                    model: models_1.Models.BrandContent
                }
            ]
        });
        if (brand && (brand === null || brand === void 0 ? void 0 : brand.id)) {
            yield models_1.Models.Brand.update({ lastUpdatedBy: userId, status: status }, { where: { id: brand.id }, transaction: transaction });
            yield transaction.commit();
            let responseObject = yield fetch(id, accountId, request.headers.language);
            responseObject = JSON.parse(JSON.stringify(responseObject));
            return h.response({ message: request.i18n.__("BRAND_STATUS_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'BRAND_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateStatus = updateStatus;
//delete brand
const deleteBrand = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let brand = yield models_1.Models.Brand.findOne({
            where: { id: id },
            include: [
                {
                    model: models_1.Models.BrandContent
                }
            ]
        });
        if (brand) {
            let newSlug = brand.code + "_" + (0, moment_1.default)().toISOString();
            yield models_1.Models.Brand.update({ code: newSlug }, { where: { id: id } });
            yield models_1.Models.Brand.destroy({ where: { id: id } });
            yield transaction.commit();
            return h.response({ message: request.i18n.__("BRAND_HAS_BEEN_DELETED_SUCCESSFULLY"), responseData: null }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'BRAND_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deleteBrand = deleteBrand;
