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
exports.deleteUserAccount = exports.updateUserSettings = exports.refreshToken = exports.resendCode = exports.verifyMobile = exports.requestChangeMobile = exports.requestChangeEmail = exports.changeStatus = exports.updateUserProfile = exports.fetchUser = exports.usersProfile = exports.userslist = exports.changePassword = exports.resetPassword = exports.forgetPassword = exports.socialLogin = exports.mobileLogin = exports.logout = exports.login = exports.verifyCode = exports.verifyToken = exports.signup = exports.generateToken = void 0;
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importStar(require("axios"));
const models_1 = require("../models");
const dbImporter_1 = require("../config/dbImporter");
const Common = __importStar(require("./common"));
const moment_1 = __importDefault(require("moment"));
// import * as Email from "./emailTemplates";
const Constants = __importStar(require("../constants"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// import axios from "axios";
const email_1 = require("./email");
const common_1 = require("./common");
const FCM = __importStar(require("./fcmToken"));
const twilio = require("twilio");
const appleKey = (kid) => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, jwks_rsa_1.default)({
        jwksUri: process.env.APPLE_AUTH_KEY_URL,
        timeout: 30000
    });
    return yield client.getSigningKey(kid);
});
const userAttributes = ['id', 'email', 'countryCode', 'mobile', 'createdAt', 'updatedAt', 'status'];
let UserProfileAttributes = ['name', 'dob', 'generalNotifications', 'paymentNotifications', 'reminderNotifications',
    // [sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", sequelize.literal('`userProfile->profileAttachment`.`unique_name`')), 'profileImage']
    [
        models_1.sequelize.literal(`CONCAT('${process.env.BASE_URL}/attachment/', \`userProfile->profileAttachment\`.unique_name)`),
        'profileImage'
    ]
];
// const createSearchIndex = async(id: number) => {
//     let searchString = "";
//     const userInfo = await Models.User.findOne({ where: { id: id } });
//     if(userInfo) {
//         searchString += userInfo.email + " ";
//         if(userInfo.mobile) {
//             searchString += userInfo.countryCode + userInfo.mobile + " ";
//         }
//         const userProfile = await Models.UserProfile.findOne({ where: { userId: id } });
//         if(userProfile) {
//             searchString += userProfile.name + " ";
//         }
//         const sellerProfile = await Models.SellerProfile.findOne({ where: { userId: id } });
//         if(sellerProfile) {
//             searchString += sellerProfile.name + " ";
//         }
//         if(searchString && searchString !== "") {
//             await userInfo.update({ searchIndex: searchString });
//         }
//         return true;
//     }
//     return false;
// }
const createSearchIndex = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let searchString = "";
    const userInfo = yield models_1.Models.User.findOne({ where: { id: id } });
    if (userInfo) {
        searchString += userInfo.email + " ";
        if (userInfo.mobile) {
            searchString += userInfo.countryCode + userInfo.mobile + " ";
        }
        const userProfile = yield models_1.Models.UserProfile.findOne({ where: { userId: id } });
        if (userProfile) {
            searchString += userProfile.name + " ";
        }
        if (searchString && searchString !== "") {
            yield userInfo.update({ searchIndex: searchString });
        }
        return true;
    }
    return false;
});
/**
 * Generate login and refresh tokens for a user based on their ID and account ID.
 * @param {number} userId - The ID of the user for whom tokens are generated.
 * @param {number | null} accountId - The ID of the account associated with the user (nullable).
 * @param {string} language - The language code used for localization.
 * @param {Sequelize.Transaction | null} transaction - Optional Sequelize transaction object for database operations.
 * @returns {Promise<Object | boolean>} - A promise that resolves with user data and tokens if successful, or false if there's an error.
 */
const loginToken = (userId_1, accountId_1, language_1, transaction_1, ...args_1) => __awaiter(void 0, [userId_1, accountId_1, language_1, transaction_1, ...args_1], void 0, function* (userId, accountId, language, transaction, tokenRequired = true) {
    var _a;
    try {
        let where = { id: userId };
        let options = {};
        if (transaction) {
            options = Object.assign(Object.assign({}, options), { transaction });
        }
        let user = yield models_1.Models.User.findOne(Object.assign(Object.assign({ where: where, subQuery: false }, options), { attributes: userAttributes, include: [
                {
                    model: models_1.Models.UserProfile, as: 'userProfile',
                    attributes: UserProfileAttributes,
                    include: [
                        { model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }
                    ]
                },
                {
                    attributes: [
                        'code',
                        'status',
                        [models_1.sequelize.literal('(case when `Roles->content`.name is not null then `Roles->content`.name else `Roles->defaultContent`.name END)'), 'name']
                    ],
                    model: models_1.Models.Role,
                    required: true,
                    subQuery: false,
                    where: { status: Constants.STATUS.ACTIVE, [dbImporter_1.Op.or]: [{ accountId: accountId }, { accountId: null }] },
                    include: [
                        {
                            attributes: [],
                            required: false,
                            subQuery: false,
                            model: models_1.Models.RoleContent, as: 'content',
                            include: [{
                                    model: models_1.Models.Language,
                                    where: { code: language },
                                    attributes: []
                                }],
                        },
                        {
                            attributes: [],
                            model: models_1.Models.RoleContent, as: 'defaultContent',
                            required: true,
                            subQuery: false,
                            include: [{
                                    attributes: [],
                                    model: models_1.Models.Language,
                                    where: { code: process.env.DEFAULT_LANGUAGE_CODE }
                                }]
                        },
                        {
                            attributes: [
                                'code',
                                'status',
                                [models_1.sequelize.literal('(case when `Roles->Permissions->content`.name is not null then `Roles->Permissions->content`.name else `Roles->Permissions->defaultContent`.name END)'), 'name']
                            ],
                            model: models_1.Models.Permission,
                            where: { status: Constants.STATUS.ACTIVE, [dbImporter_1.Op.or]: [{ accountId: accountId }, { accountId: null }] },
                            required: false,
                            subQuery: false,
                            include: [
                                {
                                    attributes: [],
                                    required: false,
                                    subQuery: false,
                                    model: models_1.Models.PermissionContent, as: 'content',
                                    include: [{
                                            model: models_1.Models.Language,
                                            where: { code: language },
                                            attributes: []
                                        }],
                                },
                                {
                                    attributes: [],
                                    model: models_1.Models.PermissionContent, as: 'defaultContent',
                                    required: false,
                                    subQuery: false,
                                    include: [{
                                            attributes: [],
                                            model: models_1.Models.Language,
                                            where: { code: process.env.DEFAULT_LANGUAGE_CODE }
                                        }]
                                }
                            ]
                        }
                    ],
                    through: {
                        attributes: []
                    }
                }
            ] }));
        if (user) {
            const { id, email, countryCode, mobile, createdAt, updatedAt, status } = user;
            const timeStamp = moment_1.default.utc();
            let permissions = [];
            for (const role of user.Roles) {
                permissions.push(role.code);
                for (const permission of role.Permissions) {
                    permissions.push(permission.code);
                }
            }
            permissions = [...new Set(permissions)];
            let returnObject = {
                id: user.id,
                accountId: accountId,
                email: user.email,
                countryCode: user.countryCode,
                mobile: user.mobile,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                status: status,
                userProfile: JSON.parse(JSON.stringify(user.userProfile)),
                Roles: JSON.parse(JSON.stringify(user.Roles)),
                permissions
            };
            if (tokenRequired === true) {
                let token = Common.signToken({ id: id, name: (_a = user.userProfile) === null || _a === void 0 ? void 0 : _a.name, accountId: accountId, email: email, countryCode: countryCode, mobile: mobile, createdAt: createdAt, updatedAt: updatedAt, status: status, timeStamp: timeStamp, applicationCode: process.env.APPLICATION_CODE, permissions: permissions, type: 'authorizationToken' }, 'authorizationToken');
                let refreshToken = Common.signToken({ token: token, id: id, accountId: accountId, type: 'refreshToken' }, 'refreshToken');
                if (token && refreshToken) {
                    returnObject["token"] = token;
                    returnObject["refreshToken"] = refreshToken;
                }
            }
            if (returnObject.id) {
                return returnObject;
            }
            else {
                return false;
            }
            // Common.setSessionToken(user.id!, token);
            // if (token && refreshToken && user) {
            //     return {
            //         id: user.id,
            //         accountId: accountId,
            //         email: user.email,
            //         countryCode: user.countryCode,
            //         mobile: user.mobile,
            //         createdAt: user.createdAt,
            //         updatedAt: user.updatedAt,
            //         status: status,
            //         token: token,
            //         refreshToken: refreshToken,
            //         userProfile: JSON.parse(JSON.stringify(user.userProfile)),
            //         roles: JSON.parse(JSON.stringify(user.Roles)),
            //         permissions
            //     }
            // } else {
            //     return false
            // }
        }
        return false;
    }
    catch (err) {
        console.log("Error in loginToken", err);
        return false;
    }
});
/**
 * Generate a token for email or mobile verification.
 * @param {Object} payload - The payload containing user information like email, mobile, and countryCode.
 * @param {string} type - The type of token to generate (e.g., email verification, password reset).
 * @param {Sequelize.Transaction} transaction - The Sequelize transaction object for database operations.
 * @returns {Promise<Object>} - A promise that resolves with an object indicating success or failure of token generation.
 */
const generateToken = (payload, type, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate a signup token for email verification
        let token = Common.signToken(payload, type);
        // Return error if token generation failed
        if (!token) {
            return { success: false, message: "TOKEN_NOT_GENERATED", data: null };
        }
        // Generate a verification code
        let code = Common.generateCode(4, 'number');
        // Use a master code in test environment
        if (+process.env.ENABLE_MASTER_CODE) {
            code = process.env.MASTER_CODE;
        }
        // Define conditions to deactivate existing tokens
        let where = { type };
        // Build WHERE clause based on available payload data
        console.log(" =============== type", type);
        console.log(" =============== type", type);
        console.log(" =============== type", type);
        console.log(" =============== type", type);
        console.log(" =============== type", type);
        if ((type === Constants.TOKEN_TYPES.SIGNUP ||
            type === Constants.TOKEN_TYPES.CHANGE_EMAIL ||
            type === Constants.TOKEN_TYPES.CHANGE_MOBILE ||
            type === Constants.TOKEN_TYPES.AGREEMENT) && payload.email) {
            where = Object.assign(Object.assign({}, where), { email: payload.email });
        }
        else if ((type === Constants.TOKEN_TYPES.FORGET_PASSWORD) && payload.countryCode && payload.mobile) {
            where = Object.assign(Object.assign({}, where), { countryCode: payload.countryCode, mobile: payload.mobile, email: payload.email || '' });
        }
        else {
            return { success: false, message: "INVALID_DATA", data: null };
        }
        // Deactivate any existing tokens matching the conditions
        yield models_1.Models.Token.update({ status: Constants.STATUS.INACTIVE }, {
            where,
            transaction
        });
        // Create a new token for email verification
        yield models_1.Models.Token.create({
            email: payload.email, token: token, code: code,
            countryCode: payload.countryCode, mobile: payload.mobile,
            username: payload.username,
            dob: payload.dob,
            status: Constants.STATUS.ACTIVE, type: type
        }, { transaction });
        return { success: true, message: "REQUEST_SUCCESSFULL", data: { token, code } };
    }
    catch (error) {
        console.log(error);
        return { success: false, message: "ERROR_WHILE_GENERATING_TOKEN_CATCH", data: null };
    }
});
exports.generateToken = generateToken;
/**
 * Verify user credentials and initiate the signup process.
 * @param payload The payload containing email, countryCode, and mobile for verification.
 * @param transaction Sequelize transaction for database operations.
 * @returns A promise that resolves with an object containing success status, message, and token data.
 */
const verifyUserCredentials = (payload, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Perform email and mobile number existence checks concurrently
        const [emailExists] = yield Promise.all([
            models_1.Models.User.findOne({ where: { email: payload.email } }),
            // Models.User.findOne({ where: { username: payload.username } })
        ]);
        const [isMobileExist] = yield Promise.all([
            models_1.Models.User.findOne({ where: { countryCode: payload === null || payload === void 0 ? void 0 : payload.countryCode, mobile: payload.mobile } }),
        ]);
        // Check if email already exists
        if (emailExists) {
            return { success: false, message: "EMAIL_ALREADY_EXISTS", data: null };
        }
        if (isMobileExist) {
            return { success: false, message: "MOBILE_ALREADY_EXISTS", data: null };
        }
        // Check if mobile username already exists
        // if (usernameExists) {
        //     return { success: false, message: "USERNAME_ALREADY_EXISTS", data: null };
        // }
        return { success: true, message: "REQUEST_SUCCESSFUL", data: null };
    }
    catch (error) {
        // Handle any errors that occur during the verification process
        return { success: false, message: "ERROR_WHILE_CREATING_USER_CATCH", data: null };
    }
});
/**
 * Create a new user in the database.
 * @param {UserPayload} payload - The user data to create.
 * @param {Sequelize.Transaction} transaction - The transaction object for atomic operations.
 * @returns {Promise<{success: boolean, message: string, data: any}>} - A promise that resolves with the result of the user creation.
 */
const createUser = (payload, devicetoken, devicetype, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verify user credentials for signup requests
        const verifyCred = yield verifyUserCredentials({ countryCode: payload.countryCode, mobile: payload.mobile, email: payload.email, username: payload.username }, transaction);
        if (verifyCred.success !== true) {
            return { success: false, message: verifyCred.message, data: null };
        }
        // Create new user with associated user profile
        const user = yield models_1.Models.User.create({
            email: payload.email,
            username: null,
            countryCode: payload.countryCode,
            mobile: payload.mobile,
            password: payload.password,
            status: 1,
            userProfile: {
                name: payload.name,
                dob: payload.dob,
                attachmentId: null
            }
        }, {
            include: [{ model: models_1.Models.UserProfile, as: "userProfile" }],
            transaction
        });
        // Check if user creation was successful
        if (!user) {
            return { success: false, message: "ERROR_WHILE_CREATING_USERS", data: null };
        }
        if (+process.env.SAAS_ENABLED) {
            yield models_1.Models.UserAccount.create({ accountId: user.id, userId: user.id, isDefault: true }, { transaction: transaction });
            //accountId = user.id;
        }
        else {
            yield models_1.Models.UserAccount.create({ accountId: null, userId: user.id, isDefault: true }, { transaction: transaction });
        }
        // Assign the default role "user" to the new user
        const roleInfo = yield models_1.Models.Role.findOne({ where: { code: "user" } });
        if (!roleInfo) {
            return { success: false, message: "ROLE_NOT_FOUND", data: null };
        }
        yield user.setRoles([roleInfo.id], { transaction });
        // Set user session
        if (devicetoken || devicetype) {
            const sessionCreated = yield FCM.setFcmToken({ userId: user === null || user === void 0 ? void 0 : user.id, devicetoken, devicetype }, transaction);
            // if (sessionCreated.success !== true) {
            //     return { success: false, message: 'Session not set', data: null };
            // }
        }
        // Return success result with the created user data
        return { success: true, message: "REQUEST_SUCCESSFULL", data: user };
    }
    catch (error) {
        // Handle any errors during user creation
        console.log(error);
        return { success: false, message: "ERROR_WHILE_CREATING_USER_CATCH", data: null };
    }
});
/**
 * Handle OTP verification.
 * @param {Hapi.RequestQuery} request - The Hapi request object containing query parameters.
 * @param {Hapi.ResponseToolkit} h - The Hapi response toolkit for generating HTTP responses.
 * @returns {Promise<Hapi.ResponseObject>} - A promise that resolves with an HTTP response containing success status and user data.
 */
const sendOtp = (countryCode, phoneNumber, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate environment variables
        if (!process.env.MASTER_CODE && !process.env.USE_TWILIO) {
            return null;
        }
        if (parseInt(process.env.USE_TWILIO) && (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER)) {
            return null;
        }
        if (parseInt(process.env.ENABLE_MASTER_CODE)) {
            return true;
        }
        // Override OTP with master code if enabled
        otp = parseInt(process.env.USE_TWILIO) ? otp : parseInt(process.env.MASTER_CODE);
        if (parseInt(process.env.USE_TWILIO) || parseInt(process.env.MASTER_CODE)) {
            const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            try {
                const message = yield client.messages.create({
                    body: `Greetings from Night club: Your Verification Code is ${otp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `${countryCode}${phoneNumber}`
                });
                return message;
            }
            catch (twilioError) {
                console.error('Error sending OTP via Twilio:', twilioError === null || twilioError === void 0 ? void 0 : twilioError.message);
                return null;
            }
        }
    }
    catch (error) {
        console.error('Error in sendOtp function:', error.message, error.stack);
        return null;
    }
});
/**
 * Handle OTP (One-Time Password) sending process based on request parameters.
 * @param request The Hapi request object containing query parameters.
 * @param h The Hapi response toolkit for generating HTTP responses.
 * @returns A promise that resolves with an HTTP response containing success status and message.
 */
const signup = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { name, username, email, countryCode, mobile, password, dob } = request.payload;
        const responseData = { token: null };
        // Verify user credentials for signup requests
        const verifyCred = yield verifyUserCredentials({ countryCode, mobile, email, username }, transaction);
        if (verifyCred.success !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, verifyCred.message, {});
        }
        // Generate a signup token for email verification 
        const tokenData = yield (0, exports.generateToken)({ countryCode, mobile, email, password, name, username, dob }, Constants.TOKEN_TYPES.SIGNUP, transaction);
        if (tokenData.success !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, tokenData.message, {});
        }
        responseData["token"] = tokenData.data.token;
        // Check if responseData token is null after processing
        if (responseData.token === null) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_WHILE_GENERATING_TOKEN', {});
        }
        if (parseInt(process.env.USE_TWILIO)) {
            let otpSend = yield sendOtp(countryCode, mobile, (_a = tokenData === null || tokenData === void 0 ? void 0 : tokenData.data) === null || _a === void 0 ? void 0 : _a.code);
            if (!otpSend) {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'Error while sending OTP', {});
            }
        }
        yield transaction.commit();
        // let replacements = { name, code: tokenData.data!.code }
        // await sendEmail("signup_verification", replacements, [email], request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.signup = signup;
/**
 * Handle OTP (One-Time Password) verification process.
 * @param {Hapi.RequestQuery} request - The Hapi request object containing query parameters.
 * @param {Hapi.ResponseToolkit} h - The Hapi response toolkit for generating HTTP responses.
 * @returns {Promise<Hapi.ResponseObject>} - A promise that resolves with an HTTP response containing success status and message.
 */
const verifyToken = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, code } = request.payload;
        // Find the token information in the database
        const tokenInfo = yield models_1.Models.Token.findOne({ where: { token: token, code: code } });
        if (!tokenInfo) {
            return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
        }
        // Check if the token si active or not
        if (tokenInfo.status !== Constants.STATUS.ACTIVE) {
            return Common.generateError(request, 400, 'EXPIRED_TOKEN_PROVIDED', {});
        }
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: { token } }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.verifyToken = verifyToken;
/**
 * Handle OTP (One-Time Password) verification process.
 * @param {Hapi.RequestQuery} request - The Hapi request object containing query parameters.
 * @param {Hapi.ResponseToolkit} h - The Hapi response toolkit for generating HTTP responses.
 * @returns {Promise<Hapi.ResponseObject>} - A promise that resolves with an HTTP response containing success status and message.
 */
// export const verifyEmail = async (request: Hapi.RequestQuery, h: Hapi.ResponseToolkit) => {
//     const transaction = await sequelize.transaction();
//     try {
//         const { token, code } = request.payload;
//         let sendSingUpEmail = null;
//         let replacements: any = {};
//         // Find the token information in the database
//         const tokenInfo = await Models.Token.findOne({ where: { token: token, code: code, status: Constants.STATUS.ACTIVE } });
//         if (!tokenInfo) {
//             await transaction.rollback();
//             return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
//         }
//         // Validate and decode the token to get token data
//         const tokenData = await Common.validateToken(Common.decodeToken(token), tokenInfo.type);
//         if (!tokenData || !tokenData.credentials) {
//             await transaction.rollback();
//             return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
//         }
//         let userId = null;
//         if(tokenInfo.type === Constants.TOKEN_TYPES.SIGNUP) {
//             const createdUser = await createUser(tokenData.credentials?.userData, transaction);
//             console.log("createdUser=========>",createdUser)
//             if (createdUser.success !== true) {
//                 await transaction.rollback();
//                 return Common.generateError(request, 400, createdUser.message, {});
//             }
//             userId = createdUser.data!.id!;
//             sendSingUpEmail = createdUser.data!.email;
//             replacements = { name: createdUser.data!.userProfile!.name }
//         }
//         if(tokenInfo.type === Constants.TOKEN_TYPES.CHANGE_EMAIL) {
//             const email = tokenData.credentials?.userData.email;
//             userId = tokenData.credentials?.userData.userId;
//             console.log(userId)
//             const emailExists = await Models.User.findOne({ where: { email: email } });
//             if(emailExists) {
//                 await transaction.rollback();
//                 return Common.generateError(request, 400, "EMAIL_ALREADY_EXISTS", {});
//             }
//             const updateAccount = await Models.User.update({ email }, {where: { id: userId }, transaction});
//         }
//         if(tokenInfo.type === Constants.TOKEN_TYPES.CHANGE_MOBILE) {
//             const mobile = tokenData.credentials?.userData.mobile;
//             const countryCode = tokenData.credentials?.userData.countryCode;
//             userId = tokenData.credentials?.userData.userId;
//             const userExists = await Models.User.findOne({ where: { id: userId } });
//             if(!userExists) {
//                 await transaction.rollback();
//                 return Common.generateError(request, 400, "INVALID_USER", {});
//             }
//             await userExists.update({ mobile, countryCode }, {transaction});
//         }
//         // Update the token status to inactive
//         await tokenInfo.update({ status: 0 }, { transaction });
//         // Generate login token for the created user
//         const accountId = userId;
//         const responseData = await loginToken(userId, accountId, request.headers.language, transaction);
//         await transaction.commit();
//         // if(sendSingUpEmail !== null) {
//         //     await sendEmail("welcome_onboard", replacements, [sendSingUpEmail], request.headers.language);
//         // }
//         await createSearchIndex(userId);
//         return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
//     } catch (error) {
//         await transaction.rollback();
//         return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
//     }
// }
const verifyCode = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { token, code } = request.payload;
        let sendSingUpEmail = null;
        let replacements = {};
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
        let userId = null;
        if (tokenInfo.type === Constants.TOKEN_TYPES.SIGNUP) {
            const createdUser = yield createUser((_a = tokenData.credentials) === null || _a === void 0 ? void 0 : _a.userData, request.headers.devicetoken, request.headers.devicetype, transaction);
            console.log("createdUser=========>", createdUser);
            if (createdUser.success !== true) {
                yield transaction.rollback();
                return Common.generateError(request, 400, createdUser.message, {});
            }
            userId = createdUser.data.id;
            sendSingUpEmail = createdUser.data.email;
            replacements = { name: createdUser.data.userProfile.name };
        }
        if (tokenInfo.type === Constants.TOKEN_TYPES.CHANGE_EMAIL) {
            const email = (_b = tokenData.credentials) === null || _b === void 0 ? void 0 : _b.userData.email;
            userId = (_c = tokenData.credentials) === null || _c === void 0 ? void 0 : _c.userData.userId;
            console.log(userId);
            const emailExists = yield models_1.Models.User.findOne({ where: { email: email } });
            if (emailExists) {
                yield transaction.rollback();
                return Common.generateError(request, 400, "EMAIL_ALREADY_EXISTS", {});
            }
            const updateAccount = yield models_1.Models.User.update({ email }, { where: { id: userId }, transaction });
        }
        if (tokenInfo.type === Constants.TOKEN_TYPES.CHANGE_MOBILE) {
            const mobile = (_d = tokenData.credentials) === null || _d === void 0 ? void 0 : _d.userData.mobile;
            const countryCode = (_e = tokenData.credentials) === null || _e === void 0 ? void 0 : _e.userData.countryCode;
            userId = (_f = tokenData.credentials) === null || _f === void 0 ? void 0 : _f.userData.userId;
            const userExists = yield models_1.Models.User.findOne({ where: { id: userId } });
            if (!userExists) {
                yield transaction.rollback();
                return Common.generateError(request, 400, "INVALID_USER", {});
            }
            yield userExists.update({ mobile, countryCode }, { transaction });
        }
        // Update the token status to inactive
        yield tokenInfo.update({ status: 0 }, { transaction });
        // Generate login token for the created user
        const accountId = userId;
        const responseData = yield loginToken(userId, accountId, request.headers.language, transaction);
        yield transaction.commit();
        // if(sendSingUpEmail !== null) {
        //     await sendEmail("welcome_onboard", replacements, [sendSingUpEmail], request.headers.language);
        // }
        yield createSearchIndex(userId);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.verifyCode = verifyCode;
/**
 * Handle user login process.
 * @param {Hapi.RequestQuery} request - The Hapi request object containing query parameters.
 * @param {Hapi.ResponseToolkit} h - The Hapi response toolkit for generating HTTP responses.
 * @returns {Promise<Hapi.ResponseObject>} - A promise that resolves with an HTTP response containing success status and user data.
 */
const login = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { email, password, countryCode, mobile } = request.payload;
        let { devicetoken, devicetype } = request.headers;
        let userInfo;
        if (email) {
            userInfo = yield models_1.Models.User.findOne({ where: { email: email } });
        }
        else if (countryCode && mobile) { // login with mobile password
            userInfo = yield models_1.Models.User.findOne({ where: { countryCode: countryCode, mobile: mobile } });
        }
        // If no user found with provided credentials, return error
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
        }
        if (!userInfo.password) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_PASSWORD', {});
        }
        // Verify password against stored hash
        let passwordVerification = bcrypt_1.default.compareSync(password, userInfo.password);
        if (!passwordVerification) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
        }
        // Check if user account is inactive
        if (userInfo.status === Constants.STATUS.INACTIVE) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'Your account is currently inactive. Please contact the administrator for assistance', {});
        }
        const userAccountInfo = yield models_1.Models.UserAccount.findOne({ where: { userId: userInfo.id } });
        const accountId = userAccountInfo ? userAccountInfo.accountId : null;
        // Generate login token and retrieve user data
        const userData = yield loginToken(userInfo.id, accountId, request.headers.language, null);
        // Set user session
        if (devicetoken || devicetype) {
            console.log("devicetoken || devicetype==========>", devicetoken, devicetype);
            const sessionCreated = yield FCM.setFcmToken({ userId: userInfo.id, devicetoken, devicetype }, transaction);
            // if (sessionCreated.success !== true) {
            //     await transaction.rollback();
            //     return { success: false, message: 'Session not set', data: null };
            // }
        }
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: userData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.login = login;
const logout = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let validateUser = yield models_1.Models.User.findOne({ where: { id: userId } });
        let { devicetoken, devicetype } = request.headers;
        if (validateUser) {
            // Common.revokeSessionToken('user_' + userId);
            Common.revokeSessionToken(userId);
            if (devicetoken && devicetoken != null) {
                yield models_1.Models.UserSession.destroy({
                    where: { userId: userId, deviceToken: devicetoken, deviceType: devicetype },
                    force: true,
                    transaction: transaction
                });
            }
            let tokenFind = yield models_1.Models.Token.findOne({
                where: { mobile: request.auth.credentials.userData.mobile }
            });
            if (tokenFind) {
                let tokenDelete = yield models_1.Models.Token.destroy({
                    where: { mobile: request.auth.credentials.userData.mobile },
                    transaction: transaction
                });
                if (!tokenDelete) {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'Token information not deleted', {});
                }
            }
            yield transaction.commit();
            return h.response({ message: request.i18n.__('Logged out Successfully') }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'User not found', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'Something went wrong while processing your request', err);
    }
});
exports.logout = logout;
const mobileLogin = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { countryCode, mobile, password } = request.payload;
        let userInfo = yield models_1.Models.User.findOne({ where: { countryCode: countryCode, mobile: mobile } });
        // If no user found with provided credentials, return error
        if (!userInfo) {
            return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
        }
        if (!userInfo.password) {
            return Common.generateError(request, 400, 'INVALID_PASSWORD', {});
        }
        // Verify password against stored hash
        let passwordVerification = bcrypt_1.default.compareSync(password, userInfo.password);
        if (!passwordVerification) {
            return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
        }
        // Check if user account is inactive
        if (userInfo.status === Constants.STATUS.INACTIVE) {
            return Common.generateError(request, 400, 'Your account is currently inactive. Please contact the administrator for assistance', {});
        }
        const userAccountInfo = yield models_1.Models.UserAccount.findOne({ where: { userId: userInfo.id } });
        const accountId = userAccountInfo ? userAccountInfo.accountId : null;
        // Generate login token and retrieve user data
        const userData = yield loginToken(userInfo.id, accountId, request.headers.language, null);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: userData }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.mobileLogin = mobileLogin;
const getStandardFacebookUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
    if (!data.id) {
        throw new Error('Invalid token (missing id or name)');
    }
    return { facebookUserId: data.id, facebookUserName: data.name, facebookEmail: data.email };
});
const getLimitedFacebookUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, appId }) {
    const jwksClient = (0, jwks_rsa_1.default)({
        jwksUri: 'https://www.facebook.com/.well-known/oauth/openid/jwks',
    });
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, (header, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const key = yield jwksClient.getSigningKey(header.kid);
            const signingKey = key.getPublicKey();
            callback(null, signingKey);
        }), {
            algorithms: ['RS256'],
            audience: appId,
            issuer: 'https://www.facebook.com',
        }, (err, decoded) => {
            if (err)
                return reject(err);
            const decodedData = decoded;
            if (!decodedData.sub) {
                return reject(new Error('Invalid token (missing sub)'));
            }
            resolve({ facebookUserId: decodedData.sub, facebookUserName: decodedData.name, facebookEmail: decodedData.email });
        });
    });
});
const getFacebookUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, appId }) {
    try {
        return yield getStandardFacebookUser(token);
    }
    catch (error) {
        try {
            if ((0, axios_1.isAxiosError)(error)) {
                console.warn('Failed to get standard Facebook user, trying limited user');
            }
            return getLimitedFacebookUser({ token, appId });
        }
        catch (error) {
            return null;
        }
    }
});
const verifySocialLogin = (platform, accessToken, payloadEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let url = "";
        let response = null;
        switch (platform) {
            case "apple":
                const { header } = jsonwebtoken_1.default.decode(accessToken, { complete: true });
                const kid = header.kid;
                const publicKey = (yield appleKey(kid)).getPublicKey();
                response = jsonwebtoken_1.default.verify(accessToken, publicKey);
                const { sub, email } = response;
                if (email === payloadEmail)
                    return true;
                return false;
            case "google":
                url = `${process.env.GOOGLE_LOGIN_END_POINT}=${accessToken}`;
                response = yield axios_1.default.get(url);
                if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
                    const googleEmail = response.data.email;
                    if (googleEmail === payloadEmail)
                        return true;
                }
                return false;
            case "facebook":
                //   url = `${process.env.FACEBOOK_LOGIN_END_POINT}=${accessToken}`;
                //   response = await axios.get(url);
                //   return false;
                const data = yield getFacebookUser({ token: accessToken, appId: "xxxxxxxx" });
                if (data === null || data === void 0 ? void 0 : data.facebookEmail) {
                    const facebookEmail = data.facebookEmail;
                    if (facebookEmail === payloadEmail)
                        return true;
                }
                return false;
            default: {
                return false;
            }
        }
    }
    catch (err) {
        return false;
    }
});
const socialLogin = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { platform, accessToken, email, name } = request.payload;
        const verifyAccessToken = yield verifySocialLogin(platform, accessToken, email);
        if (verifyAccessToken !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_TOKEN', {});
        }
        let userId = null;
        const userExists = yield models_1.Models.User.findOne({ where: { email: email } });
        if (userExists) {
            // if(userExists.status === Constants.STATUS.INACTIVE) {
            // }
            userId = userExists.id;
        }
        else {
            const payload = { email, username: email, name, role: "user" };
            const createdUser = yield createUser(payload, request.headers.devicetoken, request.headers.devicetype, transaction);
            userId = createdUser.data.id;
        }
        if (platform === "google") {
            if (userId)
                yield models_1.Models.User.update({ googleLogin: true }, { where: { id: userId }, transaction });
        }
        if (platform === "facebook") {
            if (userId)
                yield models_1.Models.User.update({ facebookLogin: true }, { where: { id: userId }, transaction });
        }
        yield transaction.commit();
        if (!userExists)
            yield createSearchIndex(userId);
        const userAccountInfo = yield models_1.Models.UserAccount.findOne({ where: { userId: userId } });
        const accountId = userAccountInfo ? userAccountInfo.accountId : null;
        const userData = yield loginToken(userId, accountId, request.headers.language, null);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: userData }).code(200);
    }
    catch (error) {
        console.log(error);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.socialLogin = socialLogin;
/**
 * Handle OTP (One-Time Password) verification process.
 * @param {Hapi.RequestQuery} request - The Hapi request object containing query parameters.
 * @param {Hapi.ResponseToolkit} h - The Hapi response toolkit for generating HTTP responses.
 * @returns {Promise<Hapi.ResponseObject>} - A promise that resolves with an HTTP response containing success status and message.
 */
// export const forgetPassword = async(request: Hapi.RequestQuery, h: Hapi.ResponseToolkit) => {
//     const transaction = await sequelize.transaction();
//     try {
//         let { email } = request.payload;
//         // Initialize responseData object to store token
//         const responseData = { token: null };
//         // Check if email is provided to find user information
//         let userInfo = await Models.User.findOne({ where: { email: email } });
//         // If no user found with provided credentials, rollback transaction and return error
//         if(!userInfo) {
//             await transaction.rollback();
//             return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
//         }
//         const userProfileInfo = await Models.UserProfile.findOne({ where: { userId: userInfo.id } });
//         if(!userProfileInfo) {
//             await transaction.rollback();
//             return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
//         }
//         // Generate a forget password token using the provided user information
//         const tokenData = await generateToken({ email }, Constants.TOKEN_TYPES.FORGET_PASSWORD, transaction);
//         // If token generation fails, rollback transaction and return error
//         if (tokenData.success !== true) {
//             await transaction.rollback();
//             return Common.generateError(request, 400, tokenData.message, {});
//         }
//         // Assign generated token to responseData
//         responseData["token"] = tokenData.data!.token;
//         // Check if responseData token is null after processing
//         if (responseData.token === null) {
//             await transaction.rollback();
//             return Common.generateError(request, 400, 'ERROR_WHILE_GENERATING_TOKEN', {});
//         }
//         await transaction.commit();
//         let replacements = { name: userProfileInfo.name, code: tokenData.data!.code }
//         await sendEmail("reset_password", replacements, [email], request.headers.language);
//         return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
//     } catch (error) {
//         await transaction.rollback();
//         return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
//     }
// }
const forgetPassword = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { countryCode, mobile } = request.payload;
        // Initialize responseData object to store token
        const responseData = { token: null };
        // Check if email is provided to find user information
        let userInfo = yield models_1.Models.User.findOne({ where: { countryCode, mobile } });
        // If no user found with provided credentials, rollback transaction and return error
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
        }
        const userProfileInfo = yield models_1.Models.UserProfile.findOne({ where: { userId: userInfo.id } });
        if (!userProfileInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_CREDENTIALS', {});
        }
        // Generate a forget password token using the provided user information
        const tokenData = yield (0, exports.generateToken)({ countryCode, mobile, email: userInfo.email }, Constants.TOKEN_TYPES.FORGET_PASSWORD, transaction);
        // If token generation fails, rollback transaction and return error
        if (tokenData.success !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, tokenData.message, {});
        }
        // Assign generated token to responseData
        responseData["token"] = tokenData.data.token;
        // Check if responseData token is null after processing
        if (responseData.token === null) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_WHILE_GENERATING_TOKEN', {});
        }
        if (parseInt(process.env.USE_TWILIO)) {
            let otpSend = yield sendOtp(countryCode, mobile, (_a = tokenData === null || tokenData === void 0 ? void 0 : tokenData.data) === null || _a === void 0 ? void 0 : _a.code);
            if (!otpSend) {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'Error while sending OTP', {});
            }
        }
        yield transaction.commit();
        // let replacements = { name: userProfileInfo.name, code: tokenData.data!.code }
        // await sendEmail("reset_password", replacements, [email], request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.forgetPassword = forgetPassword;
/**
 * Reset Password Handler
 *
 * This function handles the password reset request. It validates the provided token,
 * updates the user's password in the database, and commits the transaction if successful,
 * or rolls back in case of an error.
 *
 * @param {Hapi.RequestQuery} request - The request object containing the payload and authentication data.
 * @param {Hapi.ResponseToolkit} h - The response toolkit.
 * @returns {Promise<Hapi.ResponseObject>} - The response object with a success message or error.
 */
const resetPassword = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { token, code, password } = request.payload;
        const tokenType = "forgetpassword";
        // Find the token information in the database
        const tokenInfo = yield models_1.Models.Token.findOne({ where: { token, code, status: Constants.STATUS.ACTIVE } });
        if (!tokenInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
        }
        // Validate and decode the token to get token data
        const tokenData = yield Common.validateToken(Common.decodeToken(token), tokenType);
        if (!tokenData || !tokenData.credentials) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
        }
        const countryCode = tokenData.credentials.userData.countryCode;
        const mobile = tokenData.credentials.userData.mobile;
        // Find the user information in the database using the email
        const userInfo = yield models_1.Models.User.findOne({ where: { countryCode, mobile } });
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_EMAIL_PROVIDED', {});
        }
        // Update the user's password within the transaction
        yield userInfo.update({ password }, { transaction });
        // Generate login token for the created user (commented out for now)
        // const responseData = await loginToken(userInfo.id, null, request.headers.language, transaction);
        // Update the token status to inactive within the transaction
        yield tokenInfo.update({ status: 0 }, { transaction });
        yield transaction.commit();
        const userAccountInfo = yield models_1.Models.UserAccount.findOne({ where: { userId: userInfo.id } });
        const accountId = userAccountInfo ? userAccountInfo.accountId : null;
        const responseData = yield loginToken(userInfo.id, accountId, request.headers.language, null);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.resetPassword = resetPassword;
/**
 * Change Password Handler
 *
 * This function handles the change password request. It updates the user's password
 * in the database and commits the transaction if successful, or rolls back in case of an error.
 *
 * @param {Hapi.RequestQuery} request - The request object containing the payload and authentication data.
 * @param {Hapi.ResponseToolkit} h - The response toolkit.
 * @returns {Promise<Hapi.ResponseObject>} - The response object with a success message or error.
 */
const changePassword = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { password, oldPassword } = request.payload;
        const userId = request.auth.credentials.userData.id;
        const userName = request.auth.credentials.userData.name;
        // Find the user information in the database using the user ID
        const userInfo = yield models_1.Models.User.findOne({ where: { id: userId }, transaction });
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_EMAIL_PROVIDED', {});
        }
        if (!userInfo.password) {
            if (oldPassword !== null) {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'INVALID_OLD_PASSWORD_PROVIDED', {});
            }
        }
        if (userInfo.password) {
            // Verify password against stored hash
            if (oldPassword === null) {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'INVALID_OLD_PASSWORD_PROVIDED', {});
            }
            let passwordVerification = bcrypt_1.default.compareSync(oldPassword, userInfo.password);
            if (!passwordVerification) {
                return Common.generateError(request, 400, 'INVALID_OLD_PASSWORD_PROVIDED', {});
            }
        }
        console.log("hello mohit");
        // Update the user's password within the transaction
        yield userInfo.update({ password }, { transaction });
        // Generate login token for the created user (commented out for now)
        // const responseData = await loginToken(userInfo.id, null, request.headers.language, transaction);
        // //Send notification to user 
        // console.log("heeeeeeeeee=====>", userName, userId, request.headers.language)
        // await sendNotification(
        //     "PASSWORD RESET", 
        //     { userName },
        //     [userId],
        //     { data: `Hello ${userName}, Your password has been reset successfully!` },
        //     request.headers.language
        // );
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: userInfo }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.changePassword = changePassword;
const userslist = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, perPage, searchText, userType, status, sortParameter, sortValue } = request.query;
        // let pageLimt = process?.env?.PAGINATION_LIMIT;
        // if(pageLimt){
        //     perPage = +pageLimt < +perPage ? +pageLimt : +perPage
        // }
        let offset = (page - 1) * perPage;
        let rolesWhere = { code: "user" };
        let where = {};
        if (status !== null)
            where = { status: status };
        // if(searchText) {
        //     searchText = searchText.replace('@','*');
        //     searchText = searchText.replace(' ','*')+'*';
        //     where = { ...where, [Op.or]: [
        //         sequelize.literal('MATCH(search_index) AGAINST(:searchText IN BOOLEAN MODE)'),
        //       ] }
        // }
        const searchReplacements = { regularText: "", SpecialText: "" };
        const order = [];
        if (searchText) {
            const searchConversion = (0, common_1.searchTextConversion)(searchText);
            searchReplacements["regularText"] = searchConversion.regularString;
            searchReplacements["SpecialText"] = searchConversion.specialString;
            let conditionArray = [];
            if ((searchConversion.regularString).length > 0) {
                conditionArray.push(models_1.sequelize.literal('MATCH(search_index) AGAINST(:regularText IN BOOLEAN MODE)'));
            }
            if ((searchConversion.specialString).length > 0) {
                conditionArray.push(models_1.sequelize.literal('MATCH(search_index) AGAINST(:SpecialText IN BOOLEAN MODE)'));
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
            order.push([sortParameter, sortValue]);
        }
        // buyers, merchants, requests
        const userInfo = yield models_1.Models.User.findAndCountAll({
            where: where,
            order: order,
            offset: offset,
            limit: perPage,
            distinct: true,
            col: "id",
            replacements: searchReplacements,
            attributes: ['id', 'username', 'email', 'mobile', 'countryCode', 'createdAt', 'updatedAt', 'status'],
            include: [
                {
                    attributes: ["id", "name", "dob", "attachmentId", "referralCode", "userId"],
                    // where: profileWhere,
                    model: models_1.Models.UserProfile, as: "userProfile",
                    include: [
                        {
                            model: models_1.Models.Attachment, as: 'profileAttachment',
                            attributes: ["id", [models_1.sequelize.fn('CONCAT', process.env.API_PATH, models_1.sequelize.literal('`userProfile->profileAttachment`.`unique_name`')), 'filePath'],
                                "fileName", "uniqueName", "extension", "status"]
                        }
                    ]
                },
                {
                    attributes: ['code', 'status', 'id',
                        [models_1.sequelize.literal('(case when `Roles->content`.name is not null then `Roles->content`.name else `Roles->defaultContent`.name END)'), 'name']
                    ],
                    model: models_1.Models.Role,
                    include: [{
                            attributes: [],
                            model: models_1.Models.RoleContent, as: 'content',
                            include: [{
                                    subQuery: true,
                                    model: models_1.Models.Language,
                                    where: { code: request.headers.language },
                                    attributes: []
                                }],
                        },
                        {
                            attributes: [],
                            model: models_1.Models.RoleContent, as: 'defaultContent',
                            include: [{
                                    subQuery: true,
                                    attributes: [],
                                    model: models_1.Models.Language,
                                    where: { code: process.env.DEFAULT_LANGUAGE_CODE }
                                }]
                        }],
                    through: {
                        attributes: []
                    }
                },
                {
                    attributes: [],
                    as: "conditional",
                    model: models_1.Models.Role,
                    where: rolesWhere
                }
            ]
        });
        let totalPages = yield Common.getTotalPages(userInfo.count, perPage);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: {
                data: userInfo.rows,
                perPage: perPage,
                page: page,
                totalRecords: userInfo.count,
                totalPages: totalPages,
                meta: {}
            } }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.userslist = userslist;
const usersProfile = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        const responseData = yield loginToken(userId, null, request.headers.language, null, false);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.usersProfile = usersProfile;
const fetchUser = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.params.id;
        const responseData = yield loginToken(userId, null, request.headers.language, null, false);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.fetchUser = fetchUser;
const updateUserProfile = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        console.log("userId=========>", userId);
        const { name, attachmentId, dob } = request.payload;
        const updateObject = {};
        const userInfo = yield models_1.Models.User.findOne({ where: { id: userId } });
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_USER', {});
        }
        const profileInfo = yield models_1.Models.UserProfile.findOne({ where: { userId: userId } });
        if (!profileInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_USER_PROFILE', {});
        }
        if (name !== null)
            updateObject["name"] = name === "" ? null : name;
        if (dob !== null)
            updateObject["dob"] = dob === "" ? null : dob;
        if (attachmentId !== null) {
            if (attachmentId !== "") {
                const attachmentInfo = yield models_1.Models.Attachment.findOne({ where: { id: attachmentId } });
                if (!attachmentInfo) {
                    yield transaction.rollback();
                    return Common.generateError(request, 400, 'INVALID_ATTACHMENT_PROVIDED', {});
                }
                updateObject["attachmentId"] = attachmentId;
            }
            else {
                updateObject["attachmentId"] = null;
            }
        }
        yield profileInfo.update(updateObject, { transaction });
        yield transaction.commit();
        yield createSearchIndex(userId);
        const userAccountInfo = yield models_1.Models.UserAccount.findOne({ where: { userId: userInfo.id } });
        const accountId = userAccountInfo ? userAccountInfo.accountId : null;
        const responseData = yield loginToken(userId, accountId, request.headers.language, null, false);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.updateUserProfile = updateUserProfile;
const changeStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.params.id;
        const status = request.payload.status;
        const userInfo = yield models_1.Models.User.findOne({ where: { id: userId } });
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_USER', {});
        }
        const updatedUser = yield userInfo.update({ status: status }, { transaction });
        yield transaction.commit();
        const responseData = yield loginToken(userId, null, request.headers.language, null, false);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.changeStatus = changeStatus;
const requestChangeEmail = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const name = request.auth.credentials.userData.name;
        const newEmail = request.payload.email;
        const tokenType = Constants.TOKEN_TYPES.CHANGE_EMAIL;
        const responseData = { token: null };
        const emailExists = yield models_1.Models.User.findOne({ where: { email: newEmail } });
        if (emailExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, "EMAIL_ALREADY_EXISTS", {});
        }
        const tokenData = yield (0, exports.generateToken)({ email: newEmail, userId: userId }, tokenType, transaction);
        if (tokenData.success !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, tokenData.message, {});
        }
        // Assign generated token to responseData
        responseData["token"] = tokenData.data.token;
        // Check if responseData token is null after processing
        if (responseData.token === null) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_WHILE_GENERATING_TOKEN', {});
        }
        yield transaction.commit();
        let replacements = { name: name, code: tokenData.data.code };
        yield (0, email_1.sendEmail)("change_email", replacements, [newEmail], request.headers.language);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.requestChangeEmail = requestChangeEmail;
const requestChangeMobile = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const email = request.auth.credentials.userData.email;
        const mobile = request.payload.mobile;
        const countryCode = request.payload.countryCode;
        const tokenType = Constants.TOKEN_TYPES.CHANGE_MOBILE;
        const responseData = { token: null };
        const userInfo = yield models_1.Models.User.findOne({ where: { id: userId } });
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, "INVALID_USER", {});
        }
        if (userInfo.mobile === mobile && userInfo.countryCode === countryCode) {
            yield transaction.rollback();
            return Common.generateError(request, 400, "NOT_ALLOWED_TO_ENTER_SAME_NUMBER", {});
        }
        const tokenData = yield (0, exports.generateToken)({ mobile, countryCode, userId: userId, email }, tokenType, transaction);
        if (tokenData.success !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, tokenData.message, {});
        }
        // Assign generated token to responseData
        responseData["token"] = tokenData.data.token;
        // Check if responseData token is null after processing
        if (responseData.token === null) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_WHILE_GENERATING_TOKEN', {});
        }
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.requestChangeMobile = requestChangeMobile;
const verifyMobile = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { token, code } = request.payload;
        // Find the token information in the database
        const tokenInfo = yield models_1.Models.Token.findOne({ where: { token: token, code: code, status: Constants.STATUS.ACTIVE } });
        if (!tokenInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
        }
        // Validate and decode the token to get token data
        const tokenData = yield Common.validateToken(Common.decodeToken(token), 'signup');
        if (!tokenData || !tokenData.credentials) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_TOKEN_PROVIDED', {});
        }
        const mobile = (_a = tokenData.credentials) === null || _a === void 0 ? void 0 : _a.userData.mobile;
        const countryCode = (_b = tokenData.credentials) === null || _b === void 0 ? void 0 : _b.userData.countryCode;
        const userId = (_c = tokenData.credentials) === null || _c === void 0 ? void 0 : _c.userData.userId;
        const emailExists = yield models_1.Models.User.findOne({ where: { id: userId } });
        if (!emailExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, "INVALID_USER", {});
        }
        yield emailExists.update({ mobile, countryCode }, { transaction });
        const responseData = yield loginToken(userId, null, request.headers.language, transaction, false);
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.verifyMobile = verifyMobile;
const resendCode = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const transaction = yield models_1.sequelize.transaction();
    try {
        const token = request.payload.token;
        let responseData = { token };
        const tokenInfo = yield models_1.Models.Token.findOne({ where: { token: token, status: Constants.STATUS.ACTIVE } });
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
        const data = tokenData.credentials.userData;
        let name = data.name;
        const newToken = yield (0, exports.generateToken)(data, tokenInfo.type, transaction);
        if (newToken.success !== true) {
            yield transaction.rollback();
            return Common.generateError(request, 400, newToken.message, {});
        }
        // Assign generated token to responseData
        responseData["token"] = newToken.data.token;
        // Check if responseData token is null after processing
        if (responseData.token === null) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_WHILE_GENERATING_TOKEN', {});
        }
        yield transaction.commit();
        let emailCode = null;
        if (tokenInfo.type === "signup") {
            emailCode = "signup_verification";
        }
        else if (tokenInfo.type === "forgetpassword") {
            emailCode = "reset_password";
        }
        else if (tokenInfo.type === "change-email") {
            emailCode = "change_email";
        }
        else if (tokenInfo.type === "agreement") {
            emailCode = "submit_agreement";
        }
        if (emailCode !== null) {
            if (name) {
                const replacements = { name: name, code: tokenInfo.code };
                yield (0, email_1.sendEmail)(emailCode, replacements, [tokenInfo.email], request.headers.language);
            }
            else {
                const userInfo = yield models_1.Models.User.findOne({
                    where: { email: tokenInfo.email },
                    include: [{
                            model: models_1.Models.UserProfile, as: "userProfile"
                        }]
                });
                if (userInfo) {
                    const replacements = { name: (_a = userInfo.userProfile) === null || _a === void 0 ? void 0 : _a.name, code: tokenInfo.code };
                    yield (0, email_1.sendEmail)(emailCode, replacements, [tokenInfo.email], request.headers.language);
                }
            }
        }
        if (parseInt(process.env.USE_TWILIO)) {
            let otpSend = yield sendOtp(data.countryCode, data.mobile, tokenInfo.code);
            if (!otpSend) {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'Error while sending OTP', {});
            }
        }
        // if(tokenInfo.type === "signup_verification" || tokenInfo.type === "reset_password" || tokenInfo.type === "change_email") {
        //     const userInfo = await Models.User.findOne({
        //         where: { email: tokenInfo.email },
        //         include: [{
        //             model: Models.UserProfile, as: "userProfile"
        //         }]
        //     });
        //     if(userInfo) {
        //         const replacements = { name: userInfo.userProfile?.name, code: tokenInfo.code }
        //         await sendEmail(tokenInfo.type, replacements, [tokenInfo.email], request.headers.language);
        //     }
        // }
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: responseData }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.resendCode = resendCode;
// Generate new token using previously shared token and refresh token
const refreshToken = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refreshToken = request.payload.refreshToken;
        let tokenData = yield Common.validateToken(Common.decodeToken(refreshToken), 'refreshToken');
        if (tokenData && tokenData.isValid) {
            if (tokenData.credentials.userData.id) {
                const responseData = yield loginToken(tokenData.credentials.userData.id, tokenData.credentials.userData.accountId, request.headers.language, null, true);
                return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: { token: responseData.token, refreshToken: responseData.refreshToken } }).code(200);
            }
            else {
                return Common.generateError(request, 400, 'INEFFICIENT_DATA_TO_REGENERATE_TOKEN', {});
            }
        }
        else {
            return Common.generateError(request, 400, 'INVALID_TOKEN', {});
        }
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.refreshToken = refreshToken;
const updateUserSettings = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const { generalNotifications, paymentNotifications, reminderNotifications } = request.payload;
        const userInfo = yield models_1.Models.User.findOne({ where: { id: userId } });
        if (!userInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_USER', {});
        }
        const profileInfo = yield models_1.Models.UserProfile.findOne({ where: { userId: userId } });
        if (!profileInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_USER_PROFILE', {});
        }
        yield profileInfo.update({ generalNotifications, paymentNotifications, reminderNotifications }, { transaction });
        yield transaction.commit();
        const userDetails = yield loginToken(userId, null, request.headers.language, null, false);
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: userDetails }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.updateUserSettings = updateUserSettings;
const createUserSession = (userId, deviceToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Models.UserSession.update({ status: 0 }, { where: { deviceToken } });
    yield models_1.Models.UserSession.create({ userId, deviceToken });
});
const deleteUser = (userId, password, request, h) => __awaiter(void 0, void 0, void 0, function* () {
    // const timeStamp = Moment.utc();
    const timeStamp = moment_1.default.utc().valueOf();
    // Find user by ID
    const customer = yield models_1.Models.User.findOne({
        where: { id: userId }
    });
    if (!customer) {
        return Common.generateError(request, 400, 'User not found', {});
    }
    // Check password
    const passwordMatch = yield bcrypt_1.default.compare(password, customer === null || customer === void 0 ? void 0 : customer.password);
    if (!passwordMatch) {
        return Common.generateError(request, 400, 'Credential mismatch', {});
    }
    // Update email and mobile to retain history and make unique
    yield models_1.Models.User.update({
        email: `${customer.email}-${timeStamp}`,
        mobile: `${customer.mobile}-${timeStamp}`
    }, { where: { id: userId } });
    // Delete user account
    yield models_1.Models.User.destroy({ where: { id: userId } });
    return h.response({ success: true, message: 'Account deleted successfully', responseData: {} }).code(200);
});
const deleteUserAccount = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = request.auth.credentials.userData;
        const { password } = request.payload;
        return yield deleteUser(userId, password, request, h);
    }
    catch (error) {
        console.error('Error deleting user account:', error);
        return h.response({ success: false, message: 'Failed to delete user account', error }).code(500);
    }
});
exports.deleteUserAccount = deleteUserAccount;
