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
exports.verifySignDocument = exports.signDocument = exports.getDocuments = exports.reGenerateDocument = exports.generateDocument = exports.generateDocumentHtmlPage = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const Constants = __importStar(require("../constants"));
const Fs = __importStar(require("fs"));
const uuid = __importStar(require("uuid"));
const routeImporter_1 = require("../config/routeImporter");
const handlebars = __importStar(require("handlebars"));
const users_1 = require("./users");
const puppeteer_1 = __importDefault(require("puppeteer"));
// import moment from "moment";
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const email_1 = require("./email");
const documentAttributes = ["id", "documentId", "userId", "attachmentId", "agreement", "isSigned", "signAttachmentId", "lastUpdatedBy", "isRevision", "revisionId", "status", [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`attachment`.`unique_name`')), 'filePath']];
const createFolderIfNotExists = (createDirectory) => {
    const dt = new Date();
    const folder = dt.getUTCFullYear() + "/" + dt.getUTCMonth() + "/" + dt.getUTCDate() + '/';
    const targetDir = 'resources/agreements/' + folder;
    if (createDirectory)
        Fs.mkdirSync(targetDir, { recursive: true });
    return targetDir;
};
const storeRevision = (Object, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let revisonObject = JSON.parse(JSON.stringify(Object));
        let revisionId = revisonObject.id;
        revisonObject = routeImporter_1._.omit(revisonObject, ['id']);
        revisonObject.isRevision = true;
        revisonObject.status = 0;
        revisonObject.revisionId = revisionId;
        let revision = yield models_1.Models.UserDocument.create(revisonObject, { transaction: transaction });
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
// const generatePdfFromUrl = async(documentId: number, userId: number) => {
//     try {
//         const encodedDocumentId = Buffer.from((documentId).toString()).toString('base64');
//         let options = { format: 'A4' };
//         let file = { url: `${process.env.FRONTEND_DOMAIN}/user/agreement/${encodedDocumentId}` };
//         console.log(file, " ============ file")
//         const bufferResponse = await html_to_pdf.generatePdf(file, options);
//         const filePath = createFolderIfNotExists(true);
//         const name = uuid.v1() + ".pdf";
//         const filename = `agreement_user_${userId}.pdf`;
//         Fs.writeFileSync(filePath+name, bufferResponse);
//         const attachment = await Models.Attachment.create({ 
//             fileName: filename, userId: userId, accountId: userId, uniqueName: name,
//             extension: ".pdf", filePath: filePath+name, type: 1, size: 0, status: 1 
//         });
//         await Models.UserDocument.update({ attachmentId: attachment.id }, { where: { id: documentId } })
//         return { success: true, message: "REQUEST_SUCCESSFULL", data: null }
//     } catch (error) {
//         console.log(error)
//         return { success: false, message: "ERROR_WHILE_GENERATING_PDF", data: null }
//     }
// }
const generatePdfFromUrl = (documentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encodedDocumentId = Buffer.from((documentId).toString()).toString('base64');
        // const url = `http://35.160.88.219:3010/user/agreement/NDE=`;
        const url = `${process.env.FRONTEND_DOMAIN}/user/agreement/${encodedDocumentId}/${(0, moment_timezone_1.default)().utc().toISOString()}`;
        console.log(url, " =========== url");
        const filePath = createFolderIfNotExists(true);
        const name = uuid.v1() + ".pdf";
        const filename = `agreement_user_${userId}.pdf`;
        const browser = yield puppeteer_1.default.launch({
            headless: true
        });
        const context = browser.defaultBrowserContext();
        const page = yield context.newPage();
        yield page.setCacheEnabled(false);
        yield page.goto(url, { waitUntil: 'networkidle2' });
        yield page.goto(url, { waitUntil: 'networkidle2' });
        yield page.goto(url, { waitUntil: 'networkidle2' });
        yield page.goto(url, { waitUntil: 'networkidle2' });
        yield page.goto(url, { waitUntil: 'networkidle2' });
        yield page.goto(url, { waitUntil: 'networkidle2' });
        yield page.goto(url, { waitUntil: 'networkidle2' });
        const pageContent = yield page.content();
        console.log(pageContent, " =============== pageContent");
        yield page.pdf({ path: filePath + name, margin: { top: 30, bottom: 30, left: 30, right: 30 } });
        yield browser.close();
        const attachment = yield models_1.Models.Attachment.create({
            fileName: filename, userId: userId, accountId: userId, uniqueName: name,
            extension: "pdf", filePath: filePath + name, type: 1, size: 0, status: 1
        });
        yield models_1.Models.UserDocument.update({ attachmentId: attachment.id }, { where: { id: documentId } });
        return { success: true, message: "REQUEST_SUCCESSFULL", data: null };
    }
    catch (error) {
        console.log(error);
        return { success: false, message: "ERROR_WHILE_GENERATING_PDF", data: null };
    }
});
function replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
}
const generateDocumentHtmlPage = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const language = request.headers.language || process.env.DEFAULT_LANGUAGE_CODE;
        const slug = request.params.slug;
        const decodedDocumentId = Buffer.from(slug, 'base64').toString('utf8');
        let documentId = Number(decodedDocumentId);
        const userDocument = yield models_1.Models.UserDocument.findOne({ where: { id: documentId } });
        if (!userDocument) {
            return Common.generateError(request, 400, 'INVALID_DOCUMENT', {});
        }
        const SellerDetails = yield models_1.Models.UserProfile.findOne({ where: { userId: userDocument.userId } });
        let content = userDocument.linkedHtml;
        content = replaceAll(content, "&lt;Stylette&gt;", "Stylette");
        content = replaceAll(content, "&lt;Sheena&gt;", "Sheena");
        const agreement = userDocument.agreement;
        agreement["companySignature"] = new handlebars.SafeString(`<img src="${process.env.SHEENA_SIGNATURE_PATH}" alt="Seller Signature">`);
        agreement["companyPersonName"] = "Sheena Jongeneel";
        if (userDocument.docSignedDate) {
            agreement["docSignedDate"] = (0, moment_timezone_1.default)(userDocument.docSignedDate).utc().format('MMM DD, YYYY HH:mm:ss');
            agreement["vendorName"] = SellerDetails === null || SellerDetails === void 0 ? void 0 : SellerDetails.name;
        }
        else {
            agreement["docSignedDate"] = "________________________________";
            agreement["vendorName"] = "________________________________";
        }
        if (userDocument.docCreatedDate) {
            agreement["docCreatedDate"] = (0, moment_timezone_1.default)(userDocument.docCreatedDate).utc().format('MMM DD, YYYY HH:mm:ss');
        }
        else {
            agreement["docCreatedDate"] = "________________________________";
        }
        let sellerSignaturePath = null;
        if (userDocument.signAttachmentId) {
            const attachmentInfo = yield models_1.Models.Attachment.findOne({ where: { id: userDocument.signAttachmentId } });
            if (attachmentInfo) {
                sellerSignaturePath = process.env.BASE_URL + '/attachment/' + attachmentInfo.uniqueName;
                // sellerSignaturePath = process.env.PROTOCOL + '://' + process.env.API_SERVER_HOST + '/attachment/' + attachmentInfo.uniqueName;
            }
        }
        if (sellerSignaturePath) {
            agreement["sellerSignature"] = new handlebars.SafeString(`<img src="${sellerSignaturePath}" alt="Seller Signature">`);
        }
        else {
            agreement["sellerSignature"] = "________________________________";
        }
        let templateToSend = handlebars.compile(content);
        let htmlToSend = templateToSend(agreement);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: { html: htmlToSend } }).code(200);
    }
    catch (error) {
        console.log(error);
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.generateDocumentHtmlPage = generateDocumentHtmlPage;
const generateDocument = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const transaction = yield models_1.sequelize.transaction();
    try {
        const authId = request.auth.credentials.userData.id;
        // const name = request.auth.credentials.userData.name;
        const userId = request.payload.userId;
        const language = request.headers.language;
        const agreement = request.payload;
        const timezone = request.headers.timezone;
        let formattedDate = (0, moment_timezone_1.default)(new Date()).tz(timezone).format('MMM DD, YYYY HH:mm:ss');
        const sellerProfileInfo = yield models_1.Models.SellerProfile.findOne({ where: { userId } });
        if (!sellerProfileInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_SELLER_PROFILE', {});
        }
        // const sellerFields = await Models.ShopRequest.findOne({ where: { userId } });
        // if(!sellerFields) {
        //     await transaction.rollback();
        //     return Common.generateError(request, 400, 'SELLER_DETAILS_PENDING', {});
        // }
        const replacements = Object.assign({}, agreement);
        // const replacements = {...agreement, ...sellerFields.requestObject}
        let fetchRawDocument = yield models_1.Models.Document.findOne({
            include: [
                {
                    model: models_1.Models.DocumentContent, as: "content",
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: language } }
                    ]
                },
                {
                    required: true,
                    model: models_1.Models.DocumentContent, as: "defaultContent",
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                }
            ]
        });
        if (!fetchRawDocument) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'DOCUMENT_NOT_FOUND', {});
        }
        fetchRawDocument = JSON.parse(JSON.stringify(fetchRawDocument));
        const content = (fetchRawDocument === null || fetchRawDocument === void 0 ? void 0 : fetchRawDocument.content) ? (_a = fetchRawDocument === null || fetchRawDocument === void 0 ? void 0 : fetchRawDocument.content) === null || _a === void 0 ? void 0 : _a.description : (_b = fetchRawDocument === null || fetchRawDocument === void 0 ? void 0 : fetchRawDocument.defaultContent) === null || _b === void 0 ? void 0 : _b.description;
        let documentId = null;
        const userDocExists = yield models_1.Models.UserDocument.findOne({ where: { isRevision: false, userId } });
        if (userDocExists) {
            yield storeRevision(userDocExists, transaction);
            yield userDocExists.update({
                attachmentId: null, agreement: replacements, lastUpdatedBy: authId, docCreatedDate: formattedDate,
                accountId: null, linkedHtml: content, isSigned: false, signAttachmentId: null, docSignedDate: null
            }, { transaction });
            documentId = userDocExists.id;
        }
        else {
            const createdDoc = yield models_1.Models.UserDocument.create({
                documentId: fetchRawDocument === null || fetchRawDocument === void 0 ? void 0 : fetchRawDocument.id, userId: userId, attachmentId: null,
                agreement: replacements, lastUpdatedBy: authId, accountId: null, linkedHtml: content,
                isSigned: false, docCreatedDate: formattedDate
            }, { transaction });
            documentId = createdDoc.id;
        }
        yield sellerProfileInfo.update({ currentStatus: Constants.SELLER_STATUS.DOCUMENT_GENERATED }, { transaction });
        yield transaction.commit();
        yield generatePdfFromUrl(documentId, userId);
        const docInfo = yield models_1.Models.UserDocument.findOne({
            where: { id: documentId },
            attributes: documentAttributes,
            include: [
                {
                    model: models_1.Models.Attachment, as: "attachment",
                    attributes: []
                }
            ]
        });
        {
            const userInfo = yield models_1.Models.User.findOne({ where: { id: userId }, include: [{ model: models_1.Models.UserProfile, as: "userProfile" }] });
            if (userInfo) {
                let emailReplacements = { name: (_c = userInfo.userProfile) === null || _c === void 0 ? void 0 : _c.name, link: process.env.SELLER_DOMAIN };
                yield (0, email_1.sendEmail)("doc_received_for_signature", emailReplacements, [userInfo.email], request.headers.language);
            }
        }
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: docInfo }).code(200);
    }
    catch (error) {
        console.log(error);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.generateDocument = generateDocument;
const reGenerateDocument = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const authId = request.auth.credentials.userData.id;
        const userId = request.params.id;
        // const timezone = request.headers.timezone;
        //let formattedDate = moment(new Date()).tz(timezone).format('MMM DD, YYYY HH:mm:ss');
        const userDocExists = yield models_1.Models.UserDocument.findOne({ where: { userId: userId, isRevision: false } });
        if (!userDocExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_DOCUMENT_ID_PROVIDED', {});
        }
        const sellerProfileInfo = yield models_1.Models.SellerProfile.findOne({ where: { userId: userDocExists.userId } });
        if (!sellerProfileInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_SELLER_PROFILE', {});
        }
        yield storeRevision(userDocExists, transaction);
        yield userDocExists.update({
            attachmentId: null, lastUpdatedBy: authId,
            accountId: null, isSigned: false, signAttachmentId: null, docSignedDate: null
        }, { transaction });
        yield sellerProfileInfo.update({ currentStatus: Constants.SELLER_STATUS.DOCUMENT_REGENERATED }, { transaction });
        yield transaction.commit();
        yield generatePdfFromUrl(userDocExists.id, userDocExists.userId);
        const docInfo = yield models_1.Models.UserDocument.findOne({
            where: { id: userDocExists.id },
            attributes: documentAttributes,
            include: [
                {
                    model: models_1.Models.Attachment, as: "attachment",
                    attributes: []
                }
            ]
        });
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: docInfo }).code(200);
    }
    catch (error) {
        console.log(error);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.reGenerateDocument = reGenerateDocument;
const getDocuments = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authId = request.auth.credentials.userData.id;
        const isRevision = request.query.isRevision;
        let userId = request.params.id;
        if (userId === null || userId == undefined) {
            userId = authId;
        }
        let where = { userId };
        if (isRevision !== null)
            where = Object.assign(Object.assign({}, where), { isRevision });
        const userDocuments = yield models_1.Models.UserDocument.findAll({
            where: where,
            order: [["isRevision", "asc"], ["id", "desc"]],
            attributes: documentAttributes,
            include: [
                {
                    model: models_1.Models.Attachment, as: "attachment",
                    attributes: []
                }
            ]
        });
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: userDocuments }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.getDocuments = getDocuments;
const signDocument = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const email = request.auth.credentials.userData.email;
        const name = request.auth.credentials.userData.name;
        const attachmentId = request.payload.attachmentId;
        const documentId = request.payload.documentId;
        const userDocument = yield models_1.Models.UserDocument.findOne({ where: { id: documentId } });
        if (!userDocument) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_DOCUMENT_ID_PROVIDED', {});
        }
        if (userDocument.status !== Constants.STATUS.ACTIVE) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_DOCUMENT_ID_PROVIDED', {});
        }
        const attachmentInfo = yield models_1.Models.Attachment.findOne({ where: { id: attachmentId } });
        if (!attachmentInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ATTACHMENT_ID_PROVIDED', {});
        }
        // await storeRevision(userDocument, transaction);
        // await userDocument.update({ isSigned: true, signAttachmentId: attachmentId }, { transaction });
        // send otp
        const tokenData = yield (0, users_1.generateToken)({ signAttachmentId: attachmentId, documentId, email }, Constants.TOKEN_TYPES.AGREEMENT, transaction);
        if (tokenData.success !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, tokenData.message, {});
        }
        yield transaction.commit();
        const replacements = { name: name, code: tokenData.data.code };
        yield (0, email_1.sendEmail)("submit_agreement", replacements, [email], request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: { token: tokenData.data.token } }).code(200);
    }
    catch (error) {
        console.log(error);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.signDocument = signDocument;
const verifySignDocument = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { token, code } = request.payload;
        const timezone = request.headers.timezone;
        // Find the token information in the database
        const tokenInfo = yield models_1.Models.Token.findOne({ where: { token: token, code: code, status: Constants.STATUS.ACTIVE } });
        if (!tokenInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
        }
        // Validate and decode the token to get token data
        const tokenData = yield Common.validateToken(Common.decodeToken(token), tokenInfo.type);
        if (!tokenData || !tokenData.credentials) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
        }
        const email = (_a = tokenData.credentials) === null || _a === void 0 ? void 0 : _a.userData.email;
        const documentId = (_b = tokenData.credentials) === null || _b === void 0 ? void 0 : _b.userData.documentId;
        const signAttachmentId = (_c = tokenData.credentials) === null || _c === void 0 ? void 0 : _c.userData.signAttachmentId;
        const userExists = yield models_1.Models.User.findOne({ where: { email: email } });
        if (!userExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, "INVALID_USER", {});
        }
        const userId = userExists.id;
        const userDocument = yield models_1.Models.UserDocument.findOne({ where: { id: documentId } });
        if (!userDocument) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_DOCUMENT_ID_PROVIDED', {});
        }
        if (userDocument.status !== Constants.STATUS.ACTIVE) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_DOCUMENT_ID_PROVIDED', {});
        }
        const attachmentInfo = yield models_1.Models.Attachment.findOne({ where: { id: signAttachmentId } });
        if (!attachmentInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ATTACHMENT_ID_PROVIDED', {});
        }
        // const formattedDate = moment(new Date()).utc().format('MMM DD, YYYY HH:mm:ss');
        let formattedDate = (0, moment_timezone_1.default)(new Date()).tz(timezone).format('MMM DD, YYYY HH:mm:ss');
        console.log(formattedDate);
        yield storeRevision(userDocument, transaction);
        yield userDocument.update({ isSigned: true, signAttachmentId: signAttachmentId, docSignedDate: formattedDate }, { transaction });
        yield tokenInfo.update({ status: 0 }, { transaction });
        yield models_1.Models.SellerProfile.update({ currentStatus: Constants.SELLER_STATUS.DOCUMENT_SIGNED }, { where: { userId }, transaction });
        yield transaction.commit();
        yield generatePdfFromUrl(documentId, userId);
        const docInfo = yield models_1.Models.UserDocument.findOne({
            where: { id: documentId },
            attributes: documentAttributes,
            include: [
                {
                    model: models_1.Models.Attachment, as: "attachment",
                    attributes: []
                }
            ]
        });
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: docInfo }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.verifySignDocument = verifySignDocument;
