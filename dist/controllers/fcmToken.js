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
exports.destroySession = exports.updateFcmToken = exports.getFcmToken = exports.setFcmToken = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const setFcmToken = (userData, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { devicetoken, devicetype, userId } = userData;
        if (!userId || !(devicetype === null || devicetype === void 0 ? void 0 : devicetype.trim())) {
            return { success: false, message: 'MISSING_PARAMETERS' };
        }
        const data = {
            userId,
            deviceToken: devicetoken || null,
            deviceType: devicetype
        };
        if (devicetoken)
            yield models_1.Models.UserSession.update({ status: 0 }, { where: { deviceToken: devicetoken } });
        yield models_1.Models.UserSession.upsert(data, { transaction });
        return { success: true, message: 'REQUEST_PROCESSED_SUCCESSFULLY' };
    }
    catch (err) {
        console.error('Error in setFcmToken:', err);
        return { success: false, message: 'Something went wrong while processing your request', error: err };
    }
});
exports.setFcmToken = setFcmToken;
const getFcmToken = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.auth.credentials.userData;
        // Fetch user session data with specified user IDs
        const userData = yield models_1.Models.UserSession.findAll({
            // where: { userId: { [Op.in]: userIds } },  if want to get deviceToken of multiple user
            where: { userId: id },
            attributes: ['deviceToken', 'deviceType']
        });
        // Check if userData is found
        if (!userData || userData.length === 0) {
            return Common.generateError(request, 400, 'NO_TOKENS_FOUND', {});
        }
        // Extract and return the device tokens
        const deviceTokens = userData.map((session) => session.deviceToken);
        return h
            .response({
            message: request.i18n.__('REQUEST_PROCESSED_SUCCESSFULLY'),
            responseData: deviceTokens
        })
            .code(200);
    }
    catch (error) {
        console.error('Error in getFcmToken:', error);
        return Common.generateError(request, 500, 'Something went wrong while processing your request', error);
    }
});
exports.getFcmToken = getFcmToken;
const updateFcmToken = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deviceToken, deviceType } = request.payload;
        const { id: userId } = request.auth.credentials.userData;
        if (!deviceToken || !userId || !deviceType) {
            return Common.generateError(request, 400, 'MISSING_PARAMETERS', {});
        }
        // Check if the device token exist
        const existingUserSession = yield models_1.Models.UserSession.findOne({
            where: {
                userId: userId,
                deviceType: deviceType
            },
            order: [['createdAt', 'DESC']]
        });
        if (!existingUserSession) {
            return Common.generateError(request, 400, 'TOKEN_DOES_NOT_EXIST', {});
        }
        yield models_1.Models.UserSession.update({ deviceToken: deviceToken, deviceType: deviceType }, { where: { id: existingUserSession.id, deviceType: existingUserSession.deviceType } });
        return h.response({ message: request.i18n.__('DEVICE_TOKEN_UPDATED_SUCCESSFULLY'), success: true }).code(200);
    }
    catch (error) {
        console.error('Error in updateFcmToken:', error);
        return Common.generateError(request, 500, 'Something went wrong while processing your request', error);
    }
});
exports.updateFcmToken = updateFcmToken;
const destroySession = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = request.auth.credentials.userData;
        const { devicetoken, devicetype } = request.headers;
        if (!devicetoken || !userId) {
            return Common.generateError(request, 404, 'MISSING_PARAMETERS', {});
        }
        const existingSession = yield models_1.Models.UserSession.findOne({
            where: { userId, deviceToken: devicetoken, deviceType: devicetype }
        });
        if (!existingSession) {
            return Common.generateError(request, 404, 'SESSION_NOT_FOUND', {});
        }
        yield existingSession.destroy();
        return h.response({ message: request.i18n.__('SESSION_DESTROYED_SUCCESSFULLY') }).code(200);
    }
    catch (error) {
        console.error('Error in destroySession:', error);
        return Common.generateError(request, 500, 'Something went wrong while processing your request', error);
    }
});
exports.destroySession = destroySession;
