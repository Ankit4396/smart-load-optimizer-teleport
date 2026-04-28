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
exports.updateStatus = exports.deleteRecord = exports.getById = exports.listForUser = exports.list = exports.getAllByUser = exports.getAll = exports.updateRequest = exports.createRequest = exports.fetch = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const ses_1 = require("../config/ses");
const emailTemplates_1 = require("../templates/emailTemplates");
const fetch = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield models_1.Models.LostAndFound.findOne({ where: { id } });
    return record;
});
exports.fetch = fetch;
const createRequest = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const userEmail = request.auth.credentials.userData.email;
        const userName = request.auth.credentials.userData.name;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        if (!hasAdminRole && !request.payload.bookingId) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'BOOKING_ID_REQUIRED_FOR_USER', {});
        }
        const { type, itemName, itemDescription, lostOrFoundDate, eventId, bookingId, contactNumber, contactCountryCode, attachmentId } = request.payload;
        let slot = '';
        let finalEventId = eventId;
        //   if (bookingId) {
        //     const booking = await Models.Booking.findOne({ where: { id: bookingId } });
        //     if (booking) {
        //       finalEventId = booking.eventId;
        //       slot = booking.slots;
        //     }
        //   } else if (eventId) {
        //     const event = await Models.Event.findOne({ where: { id: eventId } });
        //     if (event && event.slots?.length > 0) {
        //       slot = event.slots[0];
        //     }
        //   }
        const data = {
            type,
            itemName,
            itemDescription,
            lostOrFoundDate,
            eventId: finalEventId,
            bookingId,
            contactNumber,
            contactCountryCode,
            reportedBy: userId,
            itemBelongsTo: !hasAdminRole ? userId : null,
            attachmentId,
            slot,
            state: 1, // Reported
            status: 1 // Active
        };
        const createRecord = yield models_1.Models.LostAndFound.create(data, { transaction });
        if (!createRecord) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'FAILED_TO_CREATE_RECORD', {});
        }
        yield transaction.commit();
        const htmlBody = (0, emailTemplates_1.lostFoundTemplate)({
            name: userName,
            itemName,
            dateLost: lostOrFoundDate,
            email: userEmail,
            contactNumber,
            itemDescription,
        });
        yield (0, ses_1.sendEmailSES)({
            to: "info@richssandiego.com",
            subject: "New Lost & Found Request",
            htmlBody,
        });
        return h.response({
            message: request.i18n.__('RECORD_CREATED_SUCCESSFULLY'),
            responseData: createRecord
        }).code(200);
    }
    catch (err) {
        console.error(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.createRequest = createRequest;
const updateRequest = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        const { id } = request.params;
        // Fetch the existing record
        const existingRecord = yield models_1.Models.LostAndFound.findOne({ where: { id } });
        if (!existingRecord) {
            yield transaction.rollback();
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND', {});
        }
        // Check if the user has permission to update this record
        if (!hasAdminRole && existingRecord.reportedBy !== userId) {
            yield transaction.rollback();
            return Common.generateError(request, 403, 'UNAUTHORIZED_ACTION', {});
        }
        const { type, itemName, itemDescription, lostOrFoundDate, eventId, bookingId, contactNumber, contactCountryCode, attachmentId, itemBelongsTo, ownerFound, proofOfOwner, comment } = request.payload;
        let slot = existingRecord.slot;
        let finalEventId = eventId || existingRecord.eventId;
        //   if (bookingId) {
        //     const booking = await Models.Booking.findOne({ where: { id: bookingId } });
        //     if (booking) {
        //       finalEventId = booking.eventId;
        //       slot = booking.slots;
        //     }
        //   } else if (eventId) {
        //     const event = await Models.Event.findOne({ where: { id: eventId } });
        //     if (event && event.slots?.length > 0) {
        //       slot = event.slots[0];
        //     }
        //   }
        const updatedData = {
            type,
            itemName,
            itemDescription,
            lostOrFoundDate,
            // eventId: finalEventId,
            // bookingId,
            contactNumber,
            contactCountryCode,
            attachmentId,
            itemBelongsTo: !hasAdminRole ? userId : itemBelongsTo !== null && itemBelongsTo !== void 0 ? itemBelongsTo : null,
            ownerFound,
            proofOfOwner,
            comment,
            slot
        };
        // Remove undefined fields (avoid overriding with undefined)
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);
        yield models_1.Models.LostAndFound.update(updatedData, { where: { id }, transaction });
        yield transaction.commit();
        const updatedRecord = yield models_1.Models.LostAndFound.findOne({ where: { id } });
        return h.response({
            message: request.i18n.__('RECORD_UPDATED_SUCCESSFULLY'),
            responseData: updatedRecord
        }).code(200);
    }
    catch (err) {
        console.error(err);
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_UPDATE_RECORD', err);
    }
});
exports.updateRequest = updateRequest;
const getAll = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        const results = yield models_1.Models.LostAndFound.findAndCountAll({
            order: [['id', 'desc']],
            offset: offset,
            limit: perPage,
            distinct: true,
            // subQuery:false
        });
        const count = results.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(results.rows));
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
exports.getAll = getAll;
const getAllByUser = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        let { perPage, page, postType } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        const results = yield models_1.Models.LostAndFound.findAndCountAll({
            where: { reportedBy: userId },
            order: [['id', 'desc']],
            offset: offset,
            limit: perPage,
            distinct: true,
            // subQuery:false
        });
        const count = results.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(results.rows));
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
exports.getAllByUser = getAllByUser;
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield models_1.Models.LostAndFound.findAll();
        return h.response({ responseData: results }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.list = list;
const listForUser = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.auth.credentials.userData.id;
        const results = yield models_1.Models.LostAndFound.findAll({ where: { reportedBy: userId } });
        return h.response({ responseData: results }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_USER_RECORDS', err);
    }
});
exports.listForUser = listForUser;
const getById = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = request.params.id;
        const record = yield (0, exports.fetch)(id);
        if (!record) {
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND', {});
        }
        return h.response({ responseData: record }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORD', err);
    }
});
exports.getById = getById;
const deleteRecord = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const id = request.params.id;
        const deleted = yield models_1.Models.LostAndFound.destroy({ where: { id }, transaction });
        if (!deleted) {
            yield transaction.rollback();
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND_OR_ALREADY_DELETED', {});
        }
        yield transaction.commit();
        return h.response({ message: request.i18n.__('RECORD_DELETED_SUCCESSFULLY') }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_DELETE_RECORD', err);
    }
});
exports.deleteRecord = deleteRecord;
const updateStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { id } = request.params;
        const { state, status, ownerFound, itemBelongsTo, proofOfOwner, comment } = request.payload;
        const userId = request.auth.credentials.userData.id;
        const hasAdminRole = yield Common.checkRole(userId, 'admin');
        // Fetch the existing record
        const record = yield models_1.Models.LostAndFound.findOne({ where: { id } });
        if (!record) {
            yield transaction.rollback();
            return Common.generateError(request, 404, 'RECORD_NOT_FOUND', {});
        }
        // If not admin and not the owner, deny access
        if (!hasAdminRole && record.reportedBy !== userId) {
            yield transaction.rollback();
            return Common.generateError(request, 403, 'UNAUTHORIZED_ACTION', {});
        }
        yield models_1.Models.LostAndFound.update({ state, status, ownerFound, itemBelongsTo, proofOfOwner, comment }, { where: { id }, transaction });
        yield transaction.commit();
        const fetchUpdatedResult = yield models_1.Models.LostAndFound.findOne({ where: { id } });
        return h
            .response({
            message: request.i18n.__('RECORD_UPDATED_SUCCESSFULLY'),
            responseData: fetchUpdatedResult,
        })
            .code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_UPDATE_RECORD', err);
    }
});
exports.updateStatus = updateStatus;
