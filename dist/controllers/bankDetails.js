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
exports.remove = exports.list = exports.get = exports.update = exports.create = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const routeImporter_1 = require("../config/routeImporter");
const storeRevision = (Object, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let revisonObject = JSON.parse(JSON.stringify(Object));
        let revisionId = revisonObject.id;
        revisonObject = routeImporter_1._.omit(revisonObject, ['id']);
        revisonObject.isRevision = true;
        revisonObject.revisionId = revisionId;
        let revision = yield models_1.Models.BankDetail.create(revisonObject, { transaction: transaction });
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
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const details = request.payload;
        const detailsExists = yield models_1.Models.BankDetail.findOne({ where: { userId: userId, 'details.accountNumber': details.accountNumber, isRevision: false } });
        if (detailsExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'BANK_DETAILS_ALREADY_EXISTS', {});
        }
        const createdAccount = yield models_1.Models.BankDetail.create({ userId, details }, { transaction });
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: createdAccount }).code(200);
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
        const userId = request.auth.credentials.userData.id;
        const details = request.payload;
        const id = request.params.id;
        const detailsExists = yield models_1.Models.BankDetail.findOne({ where: { id: id } });
        if (!detailsExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ID_PROVIDED', {});
        }
        yield storeRevision(detailsExists, transaction);
        const updatedAccount = yield detailsExists.update({ details }, { transaction });
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: updatedAccount }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.update = update;
const get = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        const id = request.params.id;
        const detailsExists = yield models_1.Models.BankDetail.findOne({ where: { id: id } });
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: detailsExists }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.get = get;
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        const listBankDetails = yield models_1.Models.BankDetail.findAll({
            where: {
                userId: userId,
                isRevision: false
            }
        });
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: listBankDetails }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.list = list;
const remove = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const details = request.payload;
        const id = request.params.id;
        const detailsExists = yield models_1.Models.BankDetail.findOne({ where: { id: id } });
        if (!detailsExists) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ID_PROVIDED', {});
        }
        yield storeRevision(detailsExists, transaction);
        const updatedAccount = yield detailsExists.destroy({ transaction });
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFUL"), responseData: updatedAccount }).code(200);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.remove = remove;
