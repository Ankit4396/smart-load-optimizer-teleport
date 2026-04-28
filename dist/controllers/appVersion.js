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
exports.setAppVersion = exports.getAppVersion = void 0;
const models_1 = require("../models");
const dbImporter_1 = require("../config/dbImporter");
const Common = __importStar(require("./common"));
const getAppVersion = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let appVersion = yield models_1.Models.AppVersion.findOne({
            attributes: [
                'ios_soft_update', 'ios_critical_update', 'android_soft_update', 'android_critical_update'
            ],
            where: { id: { [dbImporter_1.Op.gt]: 0 } }
        });
        let responseObject = JSON.parse(JSON.stringify(appVersion));
        return h.response({ message: request.i18n.__("APP_VERSION_INFORMATION"), responseData: responseObject }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.getAppVersion = getAppVersion;
const setAppVersion = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { ios_soft_update, ios_critical_update, android_soft_update, android_critical_update } = request.payload;
        let versionData = {
            ios_soft_update: ios_soft_update, ios_critical_update: ios_critical_update, android_soft_update: android_soft_update, android_critical_update: android_critical_update
        };
        const existingRecord = yield models_1.Models.AppVersion.findOne({ where: { id: { [dbImporter_1.Op.gt]: 0 } } });
        if (existingRecord) {
            yield existingRecord.update(versionData, { transaction: transaction });
        }
        else {
            yield models_1.Models.AppVersion.create(Object.assign({}, versionData), { transaction: transaction });
        }
        let appVersion = yield models_1.Models.AppVersion.findOne({
            attributes: [
                'ios_soft_update', 'ios_critical_update', 'android_soft_update', 'android_critical_update'
            ],
            where: { id: { [dbImporter_1.Op.gt]: 0 } }, transaction
        });
        let responseObject;
        if (appVersion) {
            responseObject = JSON.parse(JSON.stringify(appVersion));
        }
        else {
            responseObject = null;
        }
        if (responseObject) {
            yield transaction.commit();
            return h.response({ message: request.i18n.__("APP_VERSION_INFORMATION_UPDATED"), responseData: responseObject }).code(200);
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'ERROR_IN_UPDATING_DATA', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.setAppVersion = setAppVersion;
