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
exports.searchTextConversion = exports.axiosRequest = exports.verifyEmailIdentitySatus = exports.sendVerificationEamil = exports.createVerificationTemplate = exports.getVerificationTemplate = exports.sendBulkTemplatedEmail = exports.createAWSSESTemplate = exports.upperkeyobject = exports.chunk = exports.slugify = exports.getTotalPages = exports.validateKeys = exports.signToken = exports.generateCode = exports.revokeSessionToken = exports.convertHtmlToText = exports.FailureError = exports.routeError = exports.generateError = exports.encryptData = exports.decryptData = exports.decodeToken = exports.setSessionToken = exports.validateToken = void 0;
const Boom = __importStar(require("@hapi/boom"));
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto = __importStar(require("crypto-js"));
const convert = __importStar(require("html-to-text"));
const nodemailer = __importStar(require("nodemailer"));
const AWS = __importStar(require("aws-sdk"));
const Fs = __importStar(require("fs"));
const node_cache_1 = __importDefault(require("node-cache"));
const moment_1 = __importDefault(require("moment"));
const _ = __importStar(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const Jwt = require('jsonwebtoken');
let sessionCache = new node_cache_1.default();
AWS.config.update({
    accessKeyId: process.env.SES_ACCESS_KEY,
    secretAccessKey: process.env.SES_ACCESS_SECRET,
    region: process.env.SES_REGION,
});
const AWS_SES = new AWS.SES();
const transporter = nodemailer.createTransport({
    SES: new AWS.SES({
        apiVersion: '2010-12-01',
    }),
});
const convertHtmlToText = (html) => __awaiter(void 0, void 0, void 0, function* () {
    const text = convert.htmlToText(html, {});
    return text || '';
});
exports.convertHtmlToText = convertHtmlToText;
const encrypt = (text) => {
    let encrypted = crypto.AES.encrypt(text, process.env.CRYPTO_KEY).toString();
    return encrypted;
};
const generateError = (request, type, message, err) => {
    console.log(err);
    let error;
    switch (type) {
        case 500:
            error = Boom.badImplementation(message);
            error.output.payload.error = request.i18n.__('INTERNAL_SERVER_ERROR');
            error.output.payload.message = request.i18n.__(message);
            error.output.payload.errors = err;
            console.log(err);
            break;
        case 400:
            error = Boom.badRequest(message);
            error.output.payload.error = request.i18n.__('BAD_REQUEST');
            error.output.payload.message = request.i18n.__(message);
            error.output.payload.errors = err;
            break;
        case 401:
            error = Boom.unauthorized(message);
            error.output.payload.error = request.i18n.__('UNAUTHORIZED_REQUEST');
            error.output.payload.message = request.i18n.__(message);
            error.output.payload.errors = err;
            break;
        case 403:
            error = Boom.forbidden(message);
            error.output.payload.error = request.i18n.__('PERMISSION_DENIED');
            error.output.payload.message = request.i18n.__(message);
            error.output.payload.errors = err;
            break;
        case 404:
            error = Boom.badRequest(message);
            error.output.payload.error = request.i18n.__('FILE_NOT_FOUND');
            error.output.payload.message = request.i18n.__(message);
            error.output.payload.errors = err;
            break;
        default:
            error = Boom.badImplementation(message);
            error.output.payload.error = request.i18n.__('UNKNOWN_ERROR_MESSAGE');
            error.output.payload.message = request.i18n.__(message);
            error.output.payload.errors = err;
            break;
    }
    //console.log(error);
    return error;
};
exports.generateError = generateError;
// const validateApiKey = async (apikey: string) => {
//   try {
//     let validateKey;
//     validateKey = await Models.Key.findOne({where:{key:apikey}});
//     console.log("here",validateKey);
//     if(validateKey && validateKey.userId && validateKey.accountId){
//       console.log({isValid: true,credentials:{userData:{userId:validateKey.userId,accountId:validateKey.accountId},scope:['api']}});
//       return {isValid: true,credentials:{userData:{id:validateKey.userId,accountId:validateKey.accountId},scope:['api']}}
//     }
//     else{ return {isValid: false,credential:{}} }
//   } catch (err) {
//     return { isValid: false, credentials: {} };
//   }
// }
const validateToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (token) {
            let fetchToken = JSON.parse(decrypt(token.data));
            let includeTokens = ['authorizationToken', 'refreshToken'];
            if (fetchToken.type && includeTokens.includes(fetchToken.type)) {
                if (type == 'refreshToken') {
                    if (!fetchToken.token) {
                        return false;
                    }
                    else {
                        //let validSessionToken1=Jwt.verify(sessionCache.get('user_'+fetchToken.id),process.env.JWT_PRIVATE_KEY);
                        let updatedToken = module.exports.decodeToken(fetchToken.token);
                        token = updatedToken;
                    }
                }
                if (1 == +process.env.ENABLE_SINGLE_SESSSION && sessionCache.get('user_' + fetchToken.id)) {
                    let validSessionToken = Jwt.verify(sessionCache.get('user_' + fetchToken.id), process.env.JWT_PRIVATE_KEY);
                    if (validSessionToken.data != token.data) {
                        return {
                            isValid: false
                        };
                    }
                }
                else if (1 == +process.env.ENABLE_SINGLE_SESSSION) {
                    return {
                        isValid: false
                    };
                }
            }
            var diff = (0, moment_1.default)().diff((0, moment_1.default)(token.iat * 1000));
            if (diff > 0) {
                return {
                    isValid: true,
                    credentials: { userData: fetchToken, scope: fetchToken.permissions }
                };
            }
            return {
                isValid: false
            };
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.validateToken = validateToken;
const decodeToken = (token) => {
    let decodedToken = (0, jsonwebtoken_1.decode)(token);
    return (0, jsonwebtoken_1.decode)(token);
};
exports.decodeToken = decodeToken;
const decryptData = (text) => {
    console.log(text);
    try {
        if (text) {
            let decrypted = crypto.AES.decrypt(text, process.env.DATA_KEY).toString(crypto.enc.Utf8);
            return JSON.parse(decrypted);
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
};
exports.decryptData = decryptData;
const decrypt = (text) => {
    console.log(text);
    try {
        if (text) {
            let decrypted = crypto.AES.decrypt(text, process.env.CRYPTO_KEY).toString(crypto.enc.Utf8);
            return decrypted;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
};
const getTotalPages = (records, perpage) => __awaiter(void 0, void 0, void 0, function* () {
    let totalPages = Math.ceil(records / perpage);
    return totalPages;
});
exports.getTotalPages = getTotalPages;
const encryptData = (json) => {
    let text = JSON.stringify(json);
    let encrypted = crypto.AES.encrypt(text, process.env.DATA_KEY).toString();
    return encrypted;
};
exports.encryptData = encryptData;
// const routeError = (errors: Joi.ErrorReport[], message: string) => {
//   errors.map((err: Joi.ErrorReport) => {
//     switch (err.code) {
//       case "any.required":
//       case "any.empty":
//       case "string.required":
//       case "string.empty":
//         err.message = message;
//         break;
//     }
//     return err;
//   });
//   return errors;
// }
const routeError = (errors, message) => {
    errors.map((err) => {
        console.log(err);
        switch (err.code) {
            case "any.required":
            case "any.empty":
            case "string.required":
            case "string.email":
            case "string.empty":
                err.message = message;
                break;
            case "string.base":
                err.message = 'INVALID_DATA_TYPE';
                break;
            case "any.unknown":
                err.message = 'UNKNOWN_FIELDS_DETECTED';
                break;
        }
        return err;
    });
    return errors;
};
exports.routeError = routeError;
const revokeSessionToken = (user) => {
    sessionCache.del(user);
};
exports.revokeSessionToken = revokeSessionToken;
// const headers = (authorized: 'authorized' | 'optionalauthorized' | 'authorizedLatLong' | 'apiheader' | null): GlobalHeaders => {
//   let globalHeaders: GlobalHeaders = {
//     language: Joi.string().optional().allow(null).default(process.env.DEFAULT_LANGUAGE_CODE),
//     timezone: Joi.string().optional().allow(null).default("UTC"),
//     connection: Joi.string().optional().allow(null).default("keep-alive"),
//     devicetoken: Joi.string().optional().allow(null, ''),
//     devicetype: Joi.string().valid('Android', 'iOS', 'WEB').optional().allow(null).default('WEB')
//   };
//   if (authorized === 'authorized') {
//     globalHeaders.authorization = Joi.string().required().description("Authorization token, for browser requests authorization cookie is in use");
//   } else if (authorized === 'optionalauthorized') {
//     globalHeaders.authorization = Joi.string().optional().description("Authorization token, for browser requests authorization cookie is in use");
//   } else if (authorized === 'authorizedLatLong') {
//     globalHeaders.authorization = Joi.string().required().description("Authorization token, for browser requests authorization cookie is in use");
//     globalHeaders.latitude = Joi.string().required().description("Latitude for user location");
//     globalHeaders.longitude = Joi.string().required().description("Latitude for user location");
//   } else if (authorized === 'apiheader') {
//     globalHeaders.apikey = Joi.string().description("Api key to consume services");
//     globalHeaders.authorization = Joi.string().description("Authorization token");
//   }
//   return globalHeaders;
// }
// const FailureError = (err: any, request: any) => {
//   const updatedError = err;
//   updatedError.output.payload.message = [];
//   const customMessages: Record<string, string> = {};
//   if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
//     err.details.forEach((error: { context?: { label?: any }; message?: any }) => {
//       const label = error.context?.label || '';
//       const errorMessage = error.message || '';
//       customMessages[label] = request.i18n.__(errorMessage);
//     });
//   }
//   delete updatedError.output.payload.validation;
//   updatedError.output.payload.error = request.i18n.__('BAD_REQUEST');
//   updatedError.output.payload.message = request.i18n.__('ERROR_WHILE_VALIDATING_REQUEST');
//   updatedError.output.payload.errors = customMessages;
//   return updatedError;
// };
const FailureError = (err, request) => {
    const updatedError = err;
    updatedError.output.payload.message = [];
    const customMessages = {};
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
        err.details.forEach((error, index) => {
            var _a;
            if (error.type == 'object.unknown') {
                err.details[index].message = request.i18n.__('UNKNOWN_KEYS_ARE_NOT_ALLOWED');
            }
            const label = ((_a = error.context) === null || _a === void 0 ? void 0 : _a.label) || '';
            const errorMessage = error.message || '';
            customMessages[label] = request.i18n.__(errorMessage);
        });
    }
    delete updatedError.output.payload.validation;
    updatedError.output.payload.error = request.i18n.__('BAD_REQUEST');
    updatedError.output.payload.message = request.i18n.__('ERROR_WHILE_VALIDATING_REQUEST');
    updatedError.output.payload.errors = customMessages;
    return updatedError;
};
exports.FailureError = FailureError;
const generateCode = (Requestedlength, type) => {
    const char = type == 'number' ? '1234567890' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; //Random Generate Every Time From This Given Char
    const length = typeof Requestedlength != 'undefined' ? Requestedlength : 4;
    let randomvalue = '';
    for (let i = 0; i < length; i++) {
        const value = Math.floor(Math.random() * char.length);
        randomvalue += char.substring(value, value + 1).toUpperCase();
    }
    return randomvalue;
};
exports.generateCode = generateCode;
const signToken = (tokenData, type) => {
    try {
        let expirationTime;
        switch (type) {
            case 'signup':
                expirationTime = '30m';
                break;
            case 'authorizationToken':
                expirationTime = '12h';
                break;
            case 'mobile-otp':
                expirationTime = '5m';
                break;
            case '2faVerification':
                expirationTime = '5m';
                break;
            case '2faAuthentication':
                expirationTime = '5m';
                break;
            default:
                expirationTime = null;
        }
        let life = {};
        if (expirationTime != null) {
            life = { expiresIn: expirationTime };
        }
        return Jwt.sign({ data: encrypt(JSON.stringify(tokenData)) }, process.env.JWT_PRIVATE_KEY, life);
    }
    catch (err) {
        return false;
    }
};
exports.signToken = signToken;
const setSessionToken = (userId, token) => {
    sessionCache.set('user_' + userId, token);
};
exports.setSessionToken = setSessionToken;
const validateKeys = (obj, keys) => {
    let verification = keys.every(key => Object.keys(obj).includes(key));
    return verification;
};
exports.validateKeys = validateKeys;
const readHTMLFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    let html = yield Fs.readFileSync(path, { encoding: "utf-8" });
    return html;
});
// Generate slug for a text
const slugify = (text, append = '') => {
    let slug = text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
    if (append) {
        slug = slug + '-' + append;
    }
    return slug;
};
exports.slugify = slugify;
const chunk = (arr, len) => {
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {
        let chunk = arr.slice(i, i += len);
        chunks.push(chunk);
    }
    return chunks;
};
exports.chunk = chunk;
// get AWS Verification template
const getVerificationTemplate = (templateName) => __awaiter(void 0, void 0, void 0, function* () {
    let awsTemplate;
    try {
        awsTemplate = yield AWS_SES.getCustomVerificationEmailTemplate({ TemplateName: templateName }).promise();
        return awsTemplate;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.getVerificationTemplate = getVerificationTemplate;
const createVerificationTemplate = (fromEmail, templateName, templateSubject, templateContent, successRedirectionURL, failureRedirectionURL) => __awaiter(void 0, void 0, void 0, function* () {
    let awsTemplate;
    try {
        //console.log("here in template");
        awsTemplate = yield AWS_SES.createCustomVerificationEmailTemplate({
            FailureRedirectionURL: failureRedirectionURL,
            FromEmailAddress: fromEmail,
            SuccessRedirectionURL: successRedirectionURL,
            TemplateContent: templateContent,
            TemplateName: templateName,
            TemplateSubject: templateSubject,
        }).promise();
        console.log(awsTemplate);
        return awsTemplate;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.createVerificationTemplate = createVerificationTemplate;
const sendVerificationEamil = (templateName, email) => __awaiter(void 0, void 0, void 0, function* () {
    let awsTemplate;
    try {
        console.log("here in template");
        let mail = yield AWS_SES.sendCustomVerificationEmail({
            EmailAddress: email,
            TemplateName: templateName
        }).promise();
        console.log(mail);
        return mail;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.sendVerificationEamil = sendVerificationEamil;
const verifyEmailIdentitySatus = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let emailVerification;
    try {
        emailVerification = yield AWS_SES.getIdentityVerificationAttributes({ Identities: [email] }).promise();
        return emailVerification;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.verifyEmailIdentitySatus = verifyEmailIdentitySatus;
// get AWS Verification template
const getAWSTemplate = (templateName) => __awaiter(void 0, void 0, void 0, function* () {
    let awsTemplate;
    try {
        awsTemplate = yield AWS_SES.getTemplate({ TemplateName: templateName }).promise();
        return awsTemplate;
    }
    catch (err) {
        return false;
    }
});
// Create AWS templete for sending emails
const createAWSSESTemplate = (title, subject, htmlMessage, textMessage) => __awaiter(void 0, void 0, void 0, function* () {
    let params = {
        Template: {
            TemplateName: title,
            SubjectPart: subject,
            HtmlPart: htmlMessage,
            TextPart: textMessage
        }
    };
    let awsTemplate;
    try {
        awsTemplate = yield getAWSTemplate(title);
        if (!awsTemplate) {
            try {
                awsTemplate = yield AWS_SES.createTemplate(params).promise();
                return awsTemplate;
            }
            catch (err) {
                return false;
            }
        }
        return awsTemplate;
    }
    catch (err) {
        return false;
    }
});
exports.createAWSSESTemplate = createAWSSESTemplate;
const sendBulkTemplatedEmail = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield AWS_SES.sendBulkTemplatedEmail(params).promise();
        return response.Status;
    }
    catch (err) {
        console.log(err);
        return false;
    }
});
exports.sendBulkTemplatedEmail = sendBulkTemplatedEmail;
const upperkeyobject = (obj, camelCase) => Object.keys(obj).reduce((acc, k) => {
    console.log(obj);
    let updatedKey = _.camelCase(k.trim());
    if (camelCase.includes(updatedKey)) {
        acc[updatedKey] = obj[k];
    }
    else {
        acc[updatedKey.toUpperCase()] = obj[k];
    }
    console.log(acc);
    return acc;
}, {});
exports.upperkeyobject = upperkeyobject;
const axiosRequest = (_a) => __awaiter(void 0, [_a], void 0, function* ({ requestUrl, requestMethod, requestHeader, requestBody, responseType = 'json' }) {
    try {
        let responseData;
        let requestObject = {
            url: requestUrl,
            headers: requestHeader,
            method: requestMethod.toLowerCase(),
            responseType: responseType
        };
        requestObject = (requestMethod.toLowerCase() === 'get')
            ? Object.assign(Object.assign({}, requestObject), { params: requestBody }) : Object.assign(Object.assign({}, requestObject), { data: requestBody });
        responseData = yield (0, axios_1.default)(requestObject);
        responseData = responseData.data;
        return responseData;
    }
    catch (error) {
        const { response } = error;
        return response ? response.data : 'AXIOS_REQUEST_FAILED';
    }
});
exports.axiosRequest = axiosRequest;
const searchTextConversion = (sentence) => {
    // Define a regular expression to match words with special characters
    const specialCharRegex = /[\W_]+/; // \W matches any non-word character, _ matches underscore
    // Split the sentence into words
    const words = sentence.split(' ');
    // Initialize arrays to hold words with and without special characters
    const specialWords = [];
    const regularWords = [];
    // Process each word
    words.forEach(word => {
        // Check if the word contains special characters
        if (specialCharRegex.test(word)) {
            // Add to special words list, wrapping it in quotes
            specialWords.push(`"${word}"`);
        }
        else {
            // Add to regular words list
            regularWords.push(word);
        }
    });
    // Create strings by joining words with spaces
    const specialString = specialWords.join(' ');
    let regularString = regularWords.join('*');
    if (regularString.length > 0) {
        regularString = '*' + regularString + '*';
    }
    // Return the two separate strings
    return { specialString, regularString };
};
exports.searchTextConversion = searchTextConversion;
