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
exports.listAllInquiriesForAdmin = exports.getAllInquiriesForUser = exports.getAllInquiriesForAdmin = exports.listAllInquiriesForUser = exports.getInquiryById = exports.deleteInquiry = exports.updateInquiryStatus = exports.updateInquiry = exports.createInquiry = exports.fetch = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const ses_1 = require("../config/ses");
const emailTemplates_1 = require("../templates/emailTemplates");
const fetch = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield models_1.Models.Inquiry.findOne({ where: { id } });
    return record;
});
exports.fetch = fetch;
const createInquiry = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const { name, date, 
        // bookingId,
        // eventId,
        // slot,
        partySize, message, contactCountryCode, contactNumber } = request.payload;
        const inquiry = yield models_1.Models.Inquiry.create({
            name,
            date,
            // bookingId,
            // eventId,
            // slot,
            partySize,
            message,
            inquiredBy: userId,
            contactCountryCode,
            contactNumber
        }, { transaction });
        yield transaction.commit();
        const htmlBody = (0, emailTemplates_1.vipInquiryTemplate)({
            name,
            date,
            partySize,
            contactNumber,
            message,
        });
        yield (0, ses_1.sendEmailSES)({
            to: "nayakp0604@gmail.com",
            subject: "New VIP Inquiry",
            htmlBody,
        });
        return h.response({
            message: request.i18n.__("RECORD_CREATED_SUCCESSFULLY"),
            responseData: inquiry
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_CREATE_RECORD', err);
    }
});
exports.createInquiry = createInquiry;
const updateInquiry = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        const { id } = request.params;
        const existing = yield models_1.Models.Inquiry.findOne({ where: { id } });
        if (!existing) {
            yield transaction.rollback();
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND', {});
        }
        if (!hasAdminRole && existing.inquiredBy !== userId) {
            yield transaction.rollback();
            return Common.generateError(request, 403, 'UNAUTHORIZED_TO_UPDATE', {});
        }
        const { name, date, 
        // bookingId,
        // eventId,
        // slot,
        partySize, message, contactCountryCode, contactNumber } = request.payload;
        yield models_1.Models.Inquiry.update({
            name,
            date,
            // bookingId,
            // eventId,
            // slot,
            partySize,
            message,
            contactCountryCode,
            contactNumber
        }, { where: { id }, transaction });
        yield transaction.commit();
        const updated = yield (0, exports.fetch)(id);
        return h.response({
            message: request.i18n.__("RECORD_UPDATED_SUCCESSFULLY"),
            responseData: updated
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_UPDATE_RECORD', err);
    }
});
exports.updateInquiry = updateInquiry;
const updateInquiryStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        const { id } = request.params;
        const { status } = request.payload;
        const existing = yield models_1.Models.Inquiry.findOne({ where: { id } });
        if (!existing) {
            yield transaction.rollback();
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND', {});
        }
        if (!hasAdminRole && existing.inquiredBy !== userId) {
            yield transaction.rollback();
            return Common.generateError(request, 403, 'UNAUTHORIZED_TO_UPDATE_STATUS', {});
        }
        yield models_1.Models.Inquiry.update({ status }, { where: { id }, transaction });
        yield transaction.commit();
        const updated = yield models_1.Models.Inquiry.findByPk(id);
        return h.response({
            message: request.i18n.__("STATUS_UPDATED_SUCCESSFULLY"),
            responseData: updated
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_UPDATE_STATUS', err);
    }
});
exports.updateInquiryStatus = updateInquiryStatus;
const deleteInquiry = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        const { id } = request.params;
        const inquiry = yield models_1.Models.Inquiry.findOne({ where: { id } });
        if (!inquiry) {
            yield transaction.rollback();
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND', {});
        }
        if (!hasAdminRole && inquiry.inquiredBy !== userId) {
            yield transaction.rollback();
            return Common.generateError(request, 403, 'UNAUTHORIZED_TO_DELETE', {});
        }
        yield models_1.Models.Inquiry.destroy({ where: { id }, transaction });
        yield transaction.commit();
        return h.response({
            message: request.i18n.__("RECORD_DELETED_SUCCESSFULLY")
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_DELETE_RECORD', err);
    }
});
exports.deleteInquiry = deleteInquiry;
const getInquiryById = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = request.params;
        const inquiry = yield models_1.Models.Inquiry.findOne({ where: { id } });
        if (!inquiry) {
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND', {});
        }
        return h.response({
            message: request.i18n.__("RECORD_FETCHED_SUCCESSFULLY"),
            responseData: inquiry
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORD', err);
    }
});
exports.getInquiryById = getInquiryById;
const listAllInquiriesForUser = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        const inquiries = yield models_1.Models.Inquiry.findAll({
            where: { inquiredBy: userId },
            order: [['createdAt', 'DESC']]
        });
        return h.response({
            message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY"),
            responseData: inquiries
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.listAllInquiriesForUser = listAllInquiriesForUser;
const getAllInquiriesForAdmin = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        const userId = request.auth.credentials.userData.id;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        if (!hasAdminRole) {
            return Common.generateError(request, 403, 'UNAUTHORIZED', {});
        }
        const inquiries = yield models_1.Models.Inquiry.findAndCountAll({
            order: [['id', 'desc']],
            offset: offset,
            limit: perPage,
            distinct: true,
        });
        const count = inquiries.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(inquiries.rows));
        return h.response({
            message: request.i18n.__("POST_LIST_REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalPages: totalPages,
                totalRecords: count
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.getAllInquiriesForAdmin = getAllInquiriesForAdmin;
const getAllInquiriesForUser = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        const userId = request.auth.credentials.userData.id;
        const inquiries = yield models_1.Models.Inquiry.findAndCountAll({
            where: { inquiredBy: userId },
            order: [['id', 'desc']],
            offset: offset,
            limit: perPage,
            distinct: true,
        });
        const count = inquiries.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(inquiries.rows));
        return h.response({
            message: request.i18n.__("POST_LIST_REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalPages: totalPages,
                totalRecords: count
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.getAllInquiriesForUser = getAllInquiriesForUser;
const listAllInquiriesForAdmin = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        if (!hasAdminRole) {
            return Common.generateError(request, 403, 'UNAUTHORIZED', {});
        }
        const inquiries = yield models_1.Models.Inquiry.findAll({
            order: [['createdAt', 'DESC']]
        });
        return h.response({
            message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY"),
            responseData: inquiries
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.listAllInquiriesForAdmin = listAllInquiriesForAdmin;
