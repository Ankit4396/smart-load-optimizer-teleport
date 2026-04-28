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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = exports.list = exports.updateProductApprovalStatus = exports.sendForApproval = exports.copyGallery = exports.gallery = exports.create = exports.fetch = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const Constants = __importStar(require("../constants"));
const dbImporter_1 = require("../config/dbImporter");
const productAttributes = [
    'id', 'storeId', 'categoryId', 'parentProductId', 'basePrice', 'sku', 'code', 'status', 'approvalStatus', 'createdAt', 'updatedAt',
    //[sequelize.fn('SUM', sequelize.literal('CASE WHEN `Product`.id != `Product`.parent_product_id THEN 1 ELSE 0 END')), 'variants'],
    [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), 'name'],
    [models_1.sequelize.literal('(case when `content`.description is not null then `content`.description else `defaultContent`.description END)'), 'description'],
];
const productAttributeAttributes = [
    'id', 'productId', 'attributeId', 'code',
    //[sequelize.fn('SUM', sequelize.literal('CASE WHEN `Product`.id != `Product`.parent_product_id THEN 1 ELSE 0 END')), 'variants'],
    [models_1.sequelize.literal('(case when `ProductAttributes->content`.value is not null then `ProductAttributes->content`.value else `ProductAttributes->defaultContent`.value END)'), 'value'],
];
const productImageAttributes = [
    "id",
    [models_1.sequelize.fn('CONCAT', process.env.PROTOCOL, '://', process.env.API_SERVER_HOST, "/attachment/", models_1.sequelize.literal('`productImage`.`unique_name`')), 'filePath']
];
//Fetch product
const fetch = (id, accountId, language) => __awaiter(void 0, void 0, void 0, function* () {
    let product = yield models_1.Models.Product.findOne({
        attributes: productAttributes,
        include: [
            {
                attributes: [],
                model: models_1.Models.ProductContent, as: 'content',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.ProductContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            },
            {
                attributes: productImageAttributes,
                model: models_1.Models.Attachment,
                as: "productImage"
            },
            {
                attributes: productAttributeAttributes,
                model: models_1.Models.ProductAttribute,
                include: [
                    {
                        attributes: [],
                        model: models_1.Models.ProductAttributeContent, as: 'content',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: language } }
                        ]
                    },
                    {
                        attributes: [],
                        model: models_1.Models.ProductAttributeContent, as: 'defaultContent',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                        ]
                    },
                    {
                        model: models_1.Models.Attribute
                    }
                ]
            }
        ],
        //where: { id: id, accountId: accountId },
        where: { id: id },
        subQuery: false,
    });
    return product;
});
exports.fetch = fetch;
// Function to generate Cartesian product of attribute values
function generateCartesianProduct(data) {
    const attributes = data;
    function helper(index, currentCombination) {
        if (index === attributes.length) {
            return [Object.assign({}, currentCombination)];
        }
        const { attributeId, values } = attributes[index];
        const combinations = [];
        for (const value of values) {
            currentCombination[attributeId] = value;
            const nextCombinations = helper(index + 1, currentCombination);
            combinations.push(...nextCombinations);
        }
        return combinations;
    }
    return helper(0, {});
}
//Create product
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let language = request.headers.language;
        // let userId = request.auth.credentials.userData.id;
        // let accountId = request.auth.credentials.userData.accountId;
        let { storeId, categoryId, name, basePrice, sku, description, attachmentId, brandId, attributes, rent = false, buy = false, preLoved = false, rentalDurationType = 0, rentalDuration = 0, rentalPrice = 0, securityDeposit = 0, prepDays = 0, preLovedPrice = 0, keywords = null } = request.payload;
        //separate the attributes into variant and non-variant attributes
        let variantAttributes = [];
        let normalAttributes = [];
        if (attributes && attributes.length > 0) {
            for (const [index, obj] of attributes.entries()) {
                let result = yield models_1.Models.Attribute.findOne({ where: { id: obj.attributeId } });
                if (result) {
                    if (result.isVariant == 1) {
                        variantAttributes.push(obj);
                    }
                    else {
                        normalAttributes.push(obj);
                    }
                }
            }
        }
        let combinations = generateCartesianProduct(variantAttributes);
        let slug = "";
        let descriptionText = yield Common.convertHtmlToText(description);
        let productsArrayData = [];
        if (combinations && combinations.length > 0) {
            let product_name_slug = yield Common.slugify(name);
            let slug_str = product_name_slug;
            for (const [index, obj] of combinations.entries()) {
                let variationName = "";
                let productName = name;
                let count = 0;
                let aa = [];
                for (const [key, value] of Object.entries(obj)) {
                    slug_str += "-" + (yield Common.slugify(value));
                    if (count == 0) {
                        variationName += value;
                    }
                    else {
                        variationName += ", " + value;
                    }
                    aa.push({ attributeId: key, value: value });
                    count++;
                }
                productName = productName + " (" + variationName + ")";
                slug = slug_str;
                slug_str = product_name_slug;
                productsArrayData.push({
                    storeId,
                    code: slug,
                    categoryId,
                    name: productName,
                    originalName: name,
                    basePrice,
                    sku,
                    description,
                    descriptionText: descriptionText,
                    keywords: keywords,
                    attachmentId,
                    brandId,
                    attributes: aa
                });
            }
        }
        else {
            productsArrayData.push({
                storeId,
                code: yield Common.slugify(name),
                categoryId,
                name: name,
                originalName: name,
                basePrice,
                sku,
                description,
                descriptionText: descriptionText,
                keywords: keywords,
                attachmentId,
                brandId,
                attributes: []
            });
        }
        if (normalAttributes && normalAttributes.length > 0) {
            if (productsArrayData && productsArrayData.length > 0) {
                for (const [index, obj] of productsArrayData.entries()) {
                    let aa = obj.attributes;
                    for (const [i, o] of normalAttributes.entries()) {
                        aa.push({
                            attributeId: o.attributeId,
                            value: o.values
                        });
                    }
                    productsArrayData[index] = Object.assign(productsArrayData[index], { attributes: aa });
                }
            }
        }
        let productArray1 = [];
        let productArray2 = [];
        let productArray3 = [];
        let productsArray = [];
        if (productsArrayData) {
            if (rent) {
                for (let [index, obj] of productsArrayData.entries()) {
                    obj = Object.assign(obj, { productType: Constants.PRODUCT_TYPE.RENT });
                    productArray1.push(Object.assign(Object.assign({}, obj), { productType: Constants.PRODUCT_TYPE.RENT }));
                }
            }
            if (buy) {
                for (const [index, obj] of productsArrayData.entries()) {
                    productArray2.push(Object.assign(Object.assign({}, obj), { productType: Constants.PRODUCT_TYPE.BUY }));
                }
            }
            if (preLoved) {
                for (const [index, obj] of productsArrayData.entries()) {
                    productArray3.push(Object.assign(Object.assign({}, obj), { productType: Constants.PRODUCT_TYPE.PRE_LOVED }));
                }
            }
            productsArray = productArray1.concat(productArray2, productArray3);
            let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.headers.language } });
            if (defaultLanguage) {
                let productParentId = 0;
                for (const [index, obj] of productsArray.entries()) {
                    let ProductContents = [];
                    let language = request.headers.language;
                    let defaultLanguageObject;
                    let requestedLanguageObject;
                    if (language != process.env.DEFAULT_LANGUAGE_CODE) {
                        if (defaultLanguage && requestedLanguage) {
                            defaultLanguageObject = {
                                originalName: obj.originalName,
                                languageId: defaultLanguage.id,
                                name: obj.name,
                                description: obj.description,
                                descriptionText: obj.descriptionText,
                                keywords: obj.keywords
                            };
                            requestedLanguageObject = {
                                originalName: obj.originalName,
                                languageId: requestedLanguage.id,
                                name: obj.name,
                                description: obj.description,
                                descriptionText: obj.descriptionText,
                                keywords: obj.keywords
                            };
                            ProductContents.push(defaultLanguageObject, requestedLanguageObject);
                        }
                    }
                    else {
                        defaultLanguageObject = {
                            originalName: obj.originalName,
                            languageId: defaultLanguage.id,
                            name: obj.name,
                            description: obj.description,
                            descriptionText: obj.descriptionText,
                            keywords: obj.keywords
                        };
                        ProductContents.push(defaultLanguageObject);
                    }
                    let product = yield models_1.Models.Product.create({
                        storeId: storeId,
                        categoryId: categoryId,
                        brandId: brandId,
                        code: obj.code,
                        productType: obj.productType,
                        attachmentId: attachmentId,
                        basePrice: basePrice,
                        sku: sku,
                        userId: 2,
                        accountId: 3,
                        rentalDurationType: obj.productType == Constants.PRODUCT_TYPE.RENT ? rentalDurationType : 0,
                        rentalDuration: obj.productType == Constants.PRODUCT_TYPE.RENT ? rentalDuration : 0,
                        rentalPrice: obj.productType == Constants.PRODUCT_TYPE.RENT ? rentalPrice : 0,
                        securityDeposit: obj.productType == Constants.PRODUCT_TYPE.RENT ? securityDeposit : 0,
                        prepDays: obj.productType == Constants.PRODUCT_TYPE.RENT ? prepDays : 0,
                        preLovedPrice: obj.productType == Constants.PRODUCT_TYPE.PRE_LOVED ? preLovedPrice : 0,
                        lastUpdatedBy: null,
                        ProductContents: ProductContents
                    }, {
                        include: [
                            { model: models_1.Models.ProductContent }
                        ],
                        transaction: transaction
                    });
                    if (product && product.id) {
                        //update productParentId, code, sku
                        if (index == 0) {
                            productParentId = product === null || product === void 0 ? void 0 : product.id;
                        }
                        yield models_1.Models.Product.update({
                            parentProductId: productParentId,
                            sku: (product === null || product === void 0 ? void 0 : product.sku) + "-" + product.id,
                            code: (product === null || product === void 0 ? void 0 : product.code) + "-" + product.id
                        }, {
                            where: {
                                id: product.id
                            },
                            transaction
                        });
                        if (obj.attributes && obj.attributes.length > 0) {
                            //Insert attribute values
                            for (const [indexAttribute, objAttribute] of obj.attributes.entries()) {
                                let ProductAttributesContents = [];
                                let defaultAttributeLanguageObject;
                                let requestedAttributeLanguageObject;
                                if (language != process.env.DEFAULT_LANGUAGE_CODE) {
                                    if (defaultLanguage && requestedLanguage) {
                                        defaultAttributeLanguageObject = {
                                            languageId: defaultLanguage.id,
                                            value: objAttribute.value,
                                        };
                                        requestedAttributeLanguageObject = {
                                            languageId: requestedLanguage.id,
                                            value: objAttribute.value,
                                        };
                                        ProductAttributesContents.push(defaultAttributeLanguageObject, requestedAttributeLanguageObject);
                                    }
                                }
                                else {
                                    defaultAttributeLanguageObject = {
                                        languageId: defaultLanguage.id,
                                        value: objAttribute.value,
                                    };
                                    ProductAttributesContents.push(defaultAttributeLanguageObject);
                                }
                                let productAttribute = yield models_1.Models.ProductAttribute.create({
                                    productId: product === null || product === void 0 ? void 0 : product.id,
                                    attributeId: parseInt(objAttribute === null || objAttribute === void 0 ? void 0 : objAttribute.attributeId),
                                    code: yield Common.slugify(objAttribute.value),
                                    ProductAttributeContents: ProductAttributesContents
                                }, {
                                    include: [
                                        { model: models_1.Models.ProductAttributeContent }
                                    ],
                                    transaction: transaction
                                });
                            }
                        }
                    }
                }
            }
            else {
            }
        }
        yield transaction.commit();
        return h.response({ message: request.i18n.__("PRODUCT_CREATED_SUCCESSFULLY"), responseData: { normalAttributes, productsArray, combinations: combinations, slug: slug } }).code(200);
    }
    catch (err) {
        console.log(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.create = create;
const gallery = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let language = request.headers.language;
        // let userId = request.auth.credentials.userData.id;
        // let accountId = request.auth.credentials.userData.accountId;
        let { storeId, productId, attachments } = request.payload;
        let product = yield models_1.Models.Product.findOne({ where: { storeId: storeId, id: productId } });
        if (product && attachments && attachments.length > 0) {
            yield models_1.Models.ProductGallery.destroy({ where: { productId: product.id }, transaction });
            for (const [index, obj] of attachments.entries()) {
                yield models_1.Models.ProductGallery.create({
                    productId: productId,
                    attachmentId: obj
                }, { transaction });
            }
            yield transaction.commit();
            return h.response({ message: request.i18n.__("PRODUCT_GALLERY_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: null }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'PRODUCT_NOT_FOUND', {});
        }
    }
    catch (err) {
        console.log(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.gallery = gallery;
const copyGallery = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let language = request.headers.language;
        // let userId = request.auth.credentials.userData.id;
        // let accountId = request.auth.credentials.userData.accountId;
        let { productId, toBeCopiedFromProductId } = request.payload;
        let product = yield models_1.Models.Product.findOne({ where: { id: productId } });
        let toBeCopiedFrom = yield models_1.Models.Product.findOne({ where: { id: toBeCopiedFromProductId, parentProductId: product === null || product === void 0 ? void 0 : product.parentProductId } });
        if (product && toBeCopiedFrom) {
            let gallery = yield models_1.Models.ProductGallery.findAll({ where: { productId: toBeCopiedFrom === null || toBeCopiedFrom === void 0 ? void 0 : toBeCopiedFrom.id } });
            if (gallery) {
                gallery = JSON.parse(JSON.stringify(gallery));
                if (gallery && gallery.length > 0) {
                    for (const [index, obj] of gallery.entries()) {
                        yield models_1.Models.ProductGallery.create({
                            productId: productId,
                            attachmentId: obj.attachmentId
                        }, { transaction });
                    }
                }
            }
            yield transaction.commit();
            return h.response({ message: request.i18n.__("PRODUCT_GALLERY_HAS_BEEN_COPIED_SUCCESSFULLY"), responseData: null }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'PRODUCT_NOT_FOUND', {});
        }
    }
    catch (err) {
        console.log(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.copyGallery = copyGallery;
//Send product to admin for approval
const sendForApproval = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let language = request.headers.language;
        let { id } = request.payload;
        let where = { id: id };
        where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.or]: [
                { approvalStatus: Constants.PRODUCT_APPROVAL_STATUS.NOT_SENT_FOR_APPROVAL },
                { approvalStatus: Constants.PRODUCT_APPROVAL_STATUS.REJECTED }
            ] });
        let product = yield models_1.Models.Product.findOne({ where: where });
        if (product) {
            yield models_1.Models.Product.update({ approvalStatus: Constants.PRODUCT_APPROVAL_STATUS.SENT_FOR_APPROVAL }, { where: { id: id } });
            yield transaction.commit();
            return h.response({ message: request.i18n.__("PRODUCT_SENT_FOR_APPROVAL"), responseData: null }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'PRODUCT_NOT_FOUND', {});
        }
    }
    catch (err) {
        console.log(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.sendForApproval = sendForApproval;
//Send product to admin for approval
const updateProductApprovalStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let language = request.headers.language;
        let { id, reason, status } = request.payload;
        let where = { id: id };
        where = Object.assign(Object.assign({}, where), { approvalStatus: Constants.PRODUCT_APPROVAL_STATUS.SENT_FOR_APPROVAL });
        let product = yield models_1.Models.Product.findOne({ where: where });
        if (product) {
            if (status == Constants.PRODUCT_APPROVAL_STATUS.REJECTED) {
                yield models_1.Models.Product.update({ approvalStatus: Constants.PRODUCT_APPROVAL_STATUS.REJECTED, reason: reason }, { where: { id: id }, transaction });
            }
            else {
                yield models_1.Models.Product.update({ approvalStatus: Constants.PRODUCT_APPROVAL_STATUS.APPROVED }, { where: { id: id }, transaction });
            }
            yield transaction.commit();
            return h.response({ message: request.i18n.__("PRODUCT_SENT_FOR_APPROVAL"), responseData: null }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'PRODUCT_NOT_FOUND', {});
        }
    }
    catch (err) {
        console.log(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateProductApprovalStatus = updateProductApprovalStatus;
// List category attributes with pagination 
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let userId = request.auth.credentials.userData.id;
        // let accountId = request.auth.credentials.userData.accountId;
        let language = request.headers.language;
        let { productType, parentProductId, perPage, page, searchText } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let where = {};
        if (searchText) {
            where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.or]: [
                    models_1.sequelize.literal('MATCH(`defaultContent`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                    models_1.sequelize.literal('MATCH(`content`.name) AGAINST(:searchText IN BOOLEAN MODE)'),
                ] });
        }
        if (productType) {
            where = Object.assign(Object.assign({}, where), { productType: productType });
        }
        if (parentProductId) {
            where = Object.assign(Object.assign({}, where), { parentProductId: parentProductId });
        }
        else {
            where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.and]: [
                    models_1.sequelize.literal('`Product`.id = `Product`.parent_product_id')
                ] });
        }
        let records = yield models_1.Models.Product.findAndCountAll({
            attributes: productAttributes,
            include: [
                {
                    attributes: [],
                    model: models_1.Models.ProductContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.ProductContent, as: 'defaultContent',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                },
                {
                    attributes: productImageAttributes,
                    model: models_1.Models.Attachment,
                    as: "productImage"
                }
            ],
            order: [['id', 'desc']],
            where: where,
            offset: offset,
            limit: perPage,
            subQuery: false,
            //group: ['parentProductId'],
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
// get a product by id
const getProduct = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = request.params;
        //let accountId = request.auth.credentials.userData.accountId;
        let accountId = 0;
        let brand = yield (0, exports.fetch)(id, accountId, request.headers.language);
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
exports.getProduct = getProduct;
