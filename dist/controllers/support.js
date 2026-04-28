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
exports.deleteSupportTicket = exports.adminReplyToTicket = exports.getTicketById = exports.getAllSupportTickets = exports.getUserTickets = exports.createSupportTicket = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const dbImporter_1 = require("../config/dbImporter");
const createSupportTicket = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = ((_c = (_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.userData) === null || _c === void 0 ? void 0 : _c.id) || null;
        const userName = ((_f = (_e = (_d = request.auth) === null || _d === void 0 ? void 0 : _d.credentials) === null || _e === void 0 ? void 0 : _e.userData) === null || _f === void 0 ? void 0 : _f.name) || 'User';
        const accountId = ((_j = (_h = (_g = request.auth) === null || _g === void 0 ? void 0 : _g.credentials) === null || _h === void 0 ? void 0 : _h.userData) === null || _j === void 0 ? void 0 : _j.accountId) || null;
        const { subject, message } = request.payload;
        const ticket = yield models_1.Models.SupportTicket.create({
            userId,
            accountId,
            subject,
            message,
            status: 0, // Open
        }, { transaction });
        yield models_1.Models.SupportMessage.create({
            supportTicketId: ticket.id,
            senderType: 2, // user
            message,
        }, { transaction });
        yield transaction.commit();
        let replacements = { name: userName, subject, message };
        // await sendEmail("signup_verification", replacements, ['mohitangaria77@gmail.com'], request.headers.language);
        return h.response({ message: request.i18n.__("TICKET_CREATED_SUCCESSFULLY"), responseData: ticket }).code(201);
    }
    catch (error) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WHILE_CREATE_SUPPORT_TICKET', error);
    }
});
exports.createSupportTicket = createSupportTicket;
const getUserTickets = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userId = ((_c = (_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.userData) === null || _c === void 0 ? void 0 : _c.id) || null;
        const tickets = yield models_1.Models.SupportTicket.findAll({
            where: { userId: userId },
            include: [
                {
                    model: models_1.Models.SupportMessage,
                    as: "messages",
                    order: [["createdAt", "ASC"]],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return h.response({ message: request.i18n.__("TICKETS_FETCHED_SUCCESSFULLY"), responseData: tickets, }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, "SOMETHING_WENT_WRONG_WITH_EXCEPTION_WHILE_FETCH_SUPPORT_TICKET", err);
    }
});
exports.getUserTickets = getUserTickets;
const getAllSupportTickets = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let { page = 1, perPage = 10, searchText, status, sortParameter = 'createdAt', sortValue = 'DESC' } = request.query;
        let { page = 1, perPage = process.env.PAGINATION_LIMIT, searchText, status, sortParameter = 'createdAt', sortValue = 'DESC' } = request.query;
        const offset = (page - 1) * perPage;
        let where = {};
        const order = [];
        // Filter by status if provided
        if (status !== undefined && status !== null) {
            where.status = status;
        }
        // Search in subject or message (fulltext or LIKE)
        if (searchText) {
            where[dbImporter_1.Op.or] = [
                { subject: { [dbImporter_1.Op.like]: `%${searchText}%` } },
                { message: { [dbImporter_1.Op.like]: `%${searchText}%` } }
            ];
        }
        // Sorting
        order.push([sortParameter, sortValue]);
        const tickets = yield models_1.Models.SupportTicket.findAndCountAll({
            where,
            offset,
            limit: perPage,
            order,
            // distinct: true,
            // col: 'id',
            attributes: ['id', 'subject', 'message', 'status', 'createdAt', 'updatedAt'],
            include: [
                {
                    model: models_1.Models.SupportMessage,
                    as: 'messages',
                    attributes: ['id', 'senderType', 'message', 'createdAt'],
                    order: [['createdAt', 'ASC']]
                },
                // {
                //     model: Models.User,
                //     as: 'user',
                //     attributes: ['id', 'username', 'email']
                // }
            ]
        });
        const totalPages = yield Common.getTotalPages(tickets.count, perPage);
        return h.response({
            message: request.i18n.__("TICKETS_FETCHED_SUCCESSFULLY"),
            responseData: {
                responseData: tickets.rows,
                perPage,
                page,
                totalRecords: tickets.count,
                totalPages,
                // meta: {}
            }
        }).code(200);
    }
    catch (error) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', error);
    }
});
exports.getAllSupportTickets = getAllSupportTickets;
const getTicketById = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const userId = ((_c = (_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.userData) === null || _c === void 0 ? void 0 : _c.id) || null;
        const accountId = ((_f = (_e = (_d = request.auth) === null || _d === void 0 ? void 0 : _d.credentials) === null || _e === void 0 ? void 0 : _e.userData) === null || _f === void 0 ? void 0 : _f.accountId) || null;
        const { id } = request.params;
        const ticket = yield models_1.Models.SupportTicket.findOne({
            where: { id },
            include: [
                {
                    model: models_1.Models.SupportMessage,
                    as: "messages",
                    order: [["createdAt", "ASC"]],
                },
            ],
        });
        if (!ticket) {
            return Common.generateError(request, 404, "TICKET_NOT_FOUND", {});
        }
        return h.response({ message: request.i18n.__("TICKET_FETCHED_SUCCESSFULLY"), responseData: ticket, }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, "SOMETHING_WENT_WRONG_WITH_EXCEPTION", err);
    }
});
exports.getTicketById = getTicketById;
const adminReplyToTicket = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const { id } = request.params;
        const { adminReply, status } = request.payload;
        const ticket = yield models_1.Models.SupportTicket.findByPk(id, { transaction });
        if (!ticket) {
            yield transaction.rollback();
            return Common.generateError(request, 404, "TICKET_NOT_FOUND", {});
        }
        yield models_1.Models.SupportMessage.create({
            supportTicketId: ticket.id,
            senderType: 1,
            message: adminReply,
        }, { transaction });
        yield ticket.update({ status }, { transaction });
        yield transaction.commit();
        return h.response({
            message: request.i18n.__("TICKET_UPDATED_SUCCESSFULLY"),
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, "SOMETHING_WENT_WRONG_WITH_EXCEPTION_WHILE_REPLY_ON_TICKET", err);
    }
});
exports.adminReplyToTicket = adminReplyToTicket;
const deleteSupportTicket = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const userId = request.auth.credentials.userData.id;
        const { id } = request.params;
        const isAdmin = Common.checkRole(userId, 'admin');
        if (!isAdmin) {
            yield transaction.rollback();
            return Common.generateError(request, 404, "NOT_AUTHORIZE_TO_TAKE_ACTION", {});
        }
        const ticket = yield models_1.Models.SupportTicket.findOne({
            where: { id, userId },
            transaction
        });
        if (!ticket) {
            yield transaction.rollback();
            return Common.generateError(request, 404, "TICKET_NOT_FOUND", {});
        }
        yield ticket.destroy({ transaction });
        yield transaction.commit();
        return h.response({
            message: request.i18n.__("TICKET_DELETED_SUCCESSFULLY"),
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, "SOMETHING_WENT_WRONG_WITH_EXCEPTION", err);
    }
});
exports.deleteSupportTicket = deleteSupportTicket;
