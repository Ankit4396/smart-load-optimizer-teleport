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
exports.generateUrlForShop = exports.listUserShops = exports.shopSettings = exports.changefeatured = exports.changeStatus = exports.list = exports.get = exports.update = exports.create = void 0;
const models_1 = require("../models");
const dbImporter_1 = require("../config/dbImporter");
const Common = __importStar(require("./common"));
const moment_1 = __importDefault(require("moment"));
const Constants = __importStar(require("../constants"));
const routeImporter_1 = require("../config/routeImporter");
const common_1 = require("./common");
const shopAttributes = ["id", "userId", "accountId", "contactName", "contactEmail", "contactCountryCode", "contactPhone", "shopUrl", "isVerified", "lastUpdatedBy", "status", [models_1.sequelize.literal('(case when `content`.name is not null then `content`.name else `defaultContent`.name END)'), "name"], [models_1.sequelize.literal('(case when `content`.description is not null then `content`.description else `defaultContent`.description END)'), "description"], "settings", "slots", "attachments", "meta", "social",
    "isfeatured", "code", "documentId"
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
// const createSearchIndex = async(id: number) => {
//     let searchString = "";
//     let shopInfo = await Models.Shop.findOne({ 
//         where: { id: id },
//         include: [
//             {
//                 model: Models.ShopContent, as: "shopContents"
//             }
//         ]
//     });
//     shopInfo = JSON.parse(JSON.stringify(shopInfo))
//     if(shopInfo) {
//         if(shopInfo.contactEmail) searchString += shopInfo.contactEmail + " ";
//         if(shopInfo.contactName) searchString += shopInfo.contactName + " ";
//         if(shopInfo.contactPhone) searchString += shopInfo.contactCountryCode + shopInfo.contactPhone + " ";
//         for(let item of shopInfo.shopContents!) {
//             if(item.name) searchString += item.name + " ";
//             if(item.description) searchString += item.description + " ";
//         }
//         if(searchString && searchString !== "") {
//             await Models.Shop.update({ searchIndex: searchString }, {where: { id: id }});
//         }
//         return true;
//     }
//     return false;
// }
const createSearchIndex = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let searchString = "";
    let shopInfo = yield models_1.Models.Shop.findOne({
        where: { id: id },
        include: [
            {
                model: models_1.Models.ShopContent, as: "shopContents"
            }
        ]
    });
    shopInfo = JSON.parse(JSON.stringify(shopInfo));
    if (shopInfo) {
        for (let item of shopInfo.shopContents) {
            if (item.name)
                searchString += item.name + " ";
        }
        if (searchString && searchString !== "") {
            yield models_1.Models.Shop.update({ searchIndex: searchString }, { where: { id: id } });
        }
        return true;
    }
    return false;
});
const storeRevision = (Object, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let revisonObject = JSON.parse(JSON.stringify(Object));
        let revisionId = revisonObject.id;
        revisonObject = routeImporter_1._.omit(revisonObject, ['id']);
        revisonObject.isRevision = true;
        revisonObject.code = revisonObject.code + '-' + (0, moment_1.default)().toISOString();
        revisonObject.revisionId = revisionId;
        for (const key in revisonObject.shopContents) {
            revisonObject.shopContents[key] = routeImporter_1._.omit(revisonObject.shopContents[key], ['id', 'shopId']);
        }
        let revision = yield models_1.Models.Shop.create(revisonObject, { include: [{ model: models_1.Models.ShopContent, as: "shopContents" }], transaction: transaction });
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
function replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
}
const fetch = (id, accountId, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let shopInfo = yield models_1.Models.Shop.findOne({
            where: { id },
            attributes: shopAttributes,
            include: [
                {
                    model: models_1.Models.Attachment, as: 'document',
                    attributes: ["id", [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`document`.`unique_name`')), 'filePath'],
                        "fileName", "uniqueName", "extension", "status"]
                },
                {
                    model: models_1.Models.ShopContent, as: "content", attributes: [],
                    include: [{ attributes: [], model: models_1.Models.Language, where: { code: language } }]
                },
                {
                    model: models_1.Models.ShopContent, as: "defaultContent", attributes: [],
                    include: [{ attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }]
                },
                {
                    model: models_1.Models.Address, as: "pickupAddress", attributes: { exclude: ["deletedAt"] },
                    where: { addressType: Constants.ADDRESS_TYPES.PICKUP }, required: false
                },
                {
                    model: models_1.Models.Address, as: "returnAddress", attributes: { exclude: ["deletedAt"] },
                    where: { addressType: Constants.ADDRESS_TYPES.RETURN }, required: false
                },
                {
                    model: models_1.Models.BankDetail, as: "bankDetails", attributes: ["id", "details", "userId"],
                    required: false
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
        if (shopInfo) {
            shopInfo = JSON.parse(replaceAll(JSON.stringify(shopInfo), "{{baseDomain}}", `${process.env.BASE_URL}`));
        }
        return shopInfo;
    }
    catch (error) {
        console.log(error);
    }
});
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const accountId = request.auth.credentials.userData.accountId;
        const userId = request.auth.credentials.userData.id;
        const { contactName, contactEmail, contactCountryCode, contactPhone, code, name, description } = request.payload;
        // const urlResponse = await generateUrl(name);
        // if(urlResponse.url !== shopUrl) {
        //     await transaction.rollback();
        //     return Common.generateError(request, 400, 'INVALID_SHOP_URL', {});
        // }
        // const code = urlResponse.code;
        const userDocumentInfo = yield models_1.Models.UserDocument.findOne({ where: { isRevision: false, userId } });
        if (!userDocumentInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'DOCUMENT_DOES_NOT_EXISTS', {});
        }
        const urlExists = yield models_1.Models.Shop.findOne({ where: { code: code } });
        if (urlExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'URL_ALREADY_EXISTS', {});
        }
        const language = request.headers.language;
        const defaultLanguage = yield models_1.Models.Language.findOne({ where: { code: process.env.DEFAULT_LANGUAGE_CODE } });
        if (!defaultLanguage) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_DEFAULT_LANGUAGE', {});
        }
        let contents = [];
        contents.push({ languageId: defaultLanguage.id, name: name, description: description });
        if (language !== defaultLanguage.code) {
            const languageInfo = yield models_1.Models.Language.findOne({ where: { code: language } });
            if (languageInfo) {
                contents.push({ languageId: languageInfo.id, name: name, description: description });
            }
        }
        const createdShop = yield models_1.Models.Shop.create({
            userId, accountId, contactName, contactEmail, contactCountryCode, code,
            contactPhone, shopUrl: code, isVerified: true, status: Constants.STATUS.ACTIVE,
            shopContents: contents, lastUpdatedBy: userId, documentId: userDocumentInfo.id
        }, { include: [{ model: models_1.Models.ShopContent, as: "shopContents" }], transaction });
        if (!createdShop) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_SHOP', {});
        }
        yield transaction.commit();
        yield createSearchIndex(createdShop.id);
        const responseData = yield fetch(createdShop.id, null, language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.create = create;
const update = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const accountId = request.auth.credentials.userData.accountId;
        const userId = request.auth.credentials.userData.id;
        const { contactName, contactEmail, contactCountryCode, contactPhone, description } = request.payload;
        const shopId = request.params.id;
        const shopInfo = yield models_1.Models.Shop.findOne({
            where: { id: shopId },
            include: [
                { model: models_1.Models.ShopContent, as: "shopContents" }
            ]
        });
        if (!shopInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_SHOP_ID_PROVIDED', {});
        }
        yield storeRevision(shopInfo, transaction);
        yield models_1.Models.Shop.update({
            contactName, contactEmail, contactCountryCode, contactPhone, lastUpdatedBy: userId
        }, {
            where: { id: shopId }, transaction
        });
        let requestedLanguageId = yield models_1.Models.Language.findOne({ where: { code: request.headers.language } });
        const existingContent = shopInfo.shopContents.find((content) => content.languageId == requestedLanguageId.id);
        if (existingContent) {
            let updatedContent = { description: '', languageId: existingContent.languageId };
            // updatedContent['name'] = name;
            updatedContent['description'] = description;
            yield models_1.Models.ShopContent.update(updatedContent, { where: { id: existingContent.id }, transaction: transaction });
        }
        else {
            let newContent = { description: '', shopId: shopId, languageId: existingContent.languageId };
            // newContent.name = name;
            newContent.description = description;
            newContent.languageId == (requestedLanguageId === null || requestedLanguageId === void 0 ? void 0 : requestedLanguageId.id);
            yield models_1.Models.ShopContent.create(newContent, { transaction: transaction });
        }
        yield transaction.commit();
        yield createSearchIndex(shopId);
        const responseData = yield fetch(shopId, null, request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.update = update;
const get = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shopId = request.params.id;
        const shopInfo = yield fetch(shopId, null, request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: shopInfo }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.get = get;
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page, searchText, userId } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let where = { isRevision: false };
        if (userId) {
            where = Object.assign(Object.assign({}, where), { userId });
        }
        const searchReplacements = { regularText: "", SpecialText: "" };
        const order = [];
        if (searchText) {
            const searchConversion = (0, common_1.searchTextConversion)(searchText);
            searchReplacements["regularText"] = searchConversion.regularString;
            searchReplacements["SpecialText"] = searchConversion.specialString;
            let conditionArray = [];
            if ((searchConversion.regularString).length > 0) {
                conditionArray.push(models_1.sequelize.literal('MATCH(`Shop`.search_index) AGAINST(:regularText IN BOOLEAN MODE)'));
            }
            if ((searchConversion.specialString).length > 0) {
                conditionArray.push(models_1.sequelize.literal('MATCH(`Shop`.search_index) AGAINST(:SpecialText IN BOOLEAN MODE)'));
            }
            if (conditionArray.length) {
                where = Object.assign(Object.assign({}, where), { [dbImporter_1.Op.or]: conditionArray });
            }
            // where = { ...where, [Op.or]: [
            //     sequelize.literal('MATCH(`Shop`.search_index) AGAINST(:regularText IN BOOLEAN MODE)'),
            //     sequelize.literal('MATCH(`Shop`.search_index) AGAINST(:SpecialText IN BOOLEAN MODE)'),
            // ]}
            // if(searchText.includes("@")) {
            //     where = { ...where, searchIndex: {[Op.like]: `%:searchText%`} }
            // } else {
            //     searchText = searchText.replace('@','*');
            //     searchText = searchText.replace(' ','*')+'*';
            //     where = { ...where, [Op.or]: [
            //         sequelize.literal('MATCH(`Shop`.search_index) AGAINST(:searchText IN BOOLEAN MODE)'),
            //     ]}
            // }
        }
        else {
            order.push(["id", "DESC"]);
        }
        const shopList = yield models_1.Models.Shop.findAndCountAll({
            replacements: searchReplacements,
            order: order,
            where: where,
            offset: offset,
            limit: perPage,
            distinct: true,
            col: "id",
            attributes: shopAttributes,
            include: [
                {
                    model: models_1.Models.Attachment, as: 'document',
                    attributes: ["id", [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`document`.`unique_name`')), 'filePath'],
                        "fileName", "uniqueName", "extension", "status"]
                },
                {
                    model: models_1.Models.ShopContent, as: "content", attributes: [],
                    include: [{ attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }]
                },
                {
                    model: models_1.Models.ShopContent, as: "defaultContent", attributes: [],
                    include: [{ attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }]
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
        let totalPages = yield Common.getTotalPages(shopList.count, perPage);
        let rows = JSON.parse(replaceAll(JSON.stringify(shopList.rows), "{{baseDomain}}", `${process.env.BASE_URL}`));
        return h.response({
            message: request.i18n.__("REQUEST_SUCCELLFULL"),
            responseData: {
                data: rows, perPage: perPage, page: page, totalRecords: shopList.count, totalPages: totalPages,
            }
        }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.list = list;
const changeStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const id = request.params.id;
        const status = request.payload.status;
        const shopInfo = yield models_1.Models.Shop.findOne({
            where: { id: id }
        });
        if (!shopInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ID_PROVIDED', {});
        }
        yield shopInfo.update({ status: status }, { transaction });
        yield transaction.commit();
        const responseData = yield fetch(id, null, request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.changeStatus = changeStatus;
const changefeatured = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const id = request.params.id;
        const status = request.payload.status;
        const shopInfo = yield models_1.Models.Shop.findOne({
            where: { id: id }
        });
        if (!shopInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ID_PROVIDED', {});
        }
        yield shopInfo.update({ isfeatured: status }, { transaction });
        yield transaction.commit();
        const responseData = yield fetch(id, null, request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.changefeatured = changefeatured;
const shopSettings = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const shopId = request.params.id;
        const settings = request.payload.settings;
        const slots = request.payload.slots;
        const attachments = request.payload.attachments;
        const meta = request.payload.meta;
        const social = request.payload.social;
        const bankAccountId = request.payload.bankAccountId;
        const shopInfo = yield models_1.Models.Shop.findOne({ where: { id: shopId } });
        if (!shopInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ID_PROVIDED', {});
        }
        const updateObject = {};
        if (settings !== null) {
            updateObject["settings"] = settings;
            //await shopInfo.update({ settings }, { transaction });
        }
        if (slots !== null) {
            updateObject["slots"] = slots;
            //await shopInfo.update({ slots }, { transaction });
        }
        if (meta !== null) {
            updateObject["meta"] = meta;
            //await shopInfo.update({ meta }, { transaction });
        }
        if (bankAccountId !== null) {
            updateObject["bankAccountId"] = bankAccountId;
            // await shopInfo.update({ bankAccountId }, { transaction });
        }
        if (social !== null) {
            updateObject["social"] = social;
            // await shopInfo.update({ social }, { transaction });
        }
        if (attachments !== null) {
            const attachmentArray = [];
            for (let item of attachments) {
                const attachmentInfo = yield models_1.Models.Attachment.findOne({ where: { id: item.attachmentId } });
                if (attachmentInfo) {
                    attachmentArray.push({
                        type: item.type,
                        attachment: {
                            id: attachmentInfo.id,
                            uniqueName: attachmentInfo.uniqueName,
                            fileName: attachmentInfo.fileName,
                            extension: attachmentInfo.extension,
                            filePath: "{{baseDomain}}/attachment/" + attachmentInfo.uniqueName,
                            size: attachmentInfo.size
                        }
                    });
                }
            }
            updateObject["attachments"] = attachmentArray;
            // await shopInfo.update({ attachments: attachmentArray }, { transaction }); 
        }
        yield shopInfo.update(updateObject, { transaction });
        yield transaction.commit();
        const responseData = yield fetch(shopId, null, request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        console.log(error);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.shopSettings = shopSettings;
const listUserShops = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let authUser = request.auth.credentials.userData.id;
        let userId = request.params.id;
        if (userId == null || userId == undefined) {
            userId = authUser;
        }
        let where = { isRevision: false, userId };
        let shopList = yield models_1.Models.Shop.findAll({
            where: where,
            attributes: shopAttributes,
            include: [
                {
                    model: models_1.Models.Attachment, as: 'document',
                    attributes: ["id", [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`document`.`unique_name`')), 'filePath'],
                        "fileName", "uniqueName", "extension", "status"]
                },
                {
                    model: models_1.Models.ShopContent, as: "content", attributes: [],
                    include: [{ attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }]
                },
                {
                    model: models_1.Models.ShopContent, as: "defaultContent", attributes: [],
                    include: [{ attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }]
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
        shopList = JSON.parse(replaceAll(JSON.stringify(shopList), "{{baseDomain}}", `${process.env.BASE_URL}`));
        return h.response({
            message: request.i18n.__("REQUEST_SUCCELLFULL"), responseData: shopList
        }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.listUserShops = listUserShops;
const generateUrl = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let slug = Common.slugify(name);
    // Step 1: Find the latest record with the same base code or a similar pattern
    const latestRecord = yield models_1.Models.Shop.findOne({
        where: {
            code: {
                [dbImporter_1.Op.like]: `${slug}%`
            }
        },
        order: [
            [models_1.sequelize.literal('LENGTH(code)'), 'DESC'],
            ['code', 'DESC']
        ]
    });
    // Step 2: Determine the next available code only if there is a matching pattern
    let nextCode;
    if (latestRecord && latestRecord.code.startsWith(slug)) {
        const match = latestRecord.code.match(/(\d+)$/);
        const suffix = match ? parseInt(match[1], 10) + 1 : 1;
        nextCode = `${slug}-${suffix}`;
    }
    else {
        nextCode = slug; // If no match, use the newCode as is
    }
    const url = `https://${nextCode}.com`;
    return { code: nextCode, url: url };
});
const generateUrlForShop = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = request.payload.code;
        const urlExists = yield models_1.Models.Shop.findOne({ where: { code: code } });
        if (urlExists) {
            return Common.generateError(request, 400, 'URL_ALREADY_EXISTS', {});
        }
        return h.response({
            message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: { proceed: true }
        }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.generateUrlForShop = generateUrlForShop;
