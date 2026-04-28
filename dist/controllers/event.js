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
exports.eventListUpdate = exports.unsavedEvent = exports.savedEvent = exports.savedEventsList = exports.pastEvents = exports.listAllEvents = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const dbImporter_1 = require("../config/dbImporter");
const axios_1 = __importDefault(require("axios"));
// export const listAllEvents = async (request: Hapi.RequestQuery, h: Hapi.ResponseToolkit) => {
//   try {
//       const response = await axios.get(
//           `https://prod-seetickets-core.seeticketsusa.us/api/v2/client/${process.env.SEE_TICKETS_CLIENT_ID}/event`,
//           {
//             headers: {
//               "api-key": process.env.SEE_TICKETS_API_KEY || "",
//               "api-secret": process.env.SEE_TICKETS_API_SECRET || "",
//             },
//           }
//         );
//        // The events returned by SeeTickets
//         const events = response.data;
//     return h.response({
//       message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY"),
//       responseData: events
//     }).code(200);
//   } catch (err) {
//     return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
//   }
// };
const listAllEvents = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        // Query parameters for filtering and pagination
        // const userId = request.auth.credentials.userData.id;
        const userId = (_d = (_c = (_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.userData) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null;
        const { name, startDate, endDate, page = 1, perPage = 20 } = request.query;
        // Fetch all events from the third-party API
        const response = yield axios_1.default.get(`https://prod-seetickets-core.seeticketsusa.us/api/v2/client/${process.env.SEE_TICKETS_CLIENT_ID}/event`, {
            headers: {
                "api-key": process.env.SEE_TICKETS_API_KEY || "",
                "api-secret": process.env.SEE_TICKETS_API_SECRET || "",
            },
        });
        let events = response.data;
        // === FILTERING ===
        // Filter by event title (case-insensitive)
        if (name) {
            const lowerName = name.toLowerCase();
            events = events.filter(event => event.title.toLowerCase().includes(lowerName));
        }
        // Filter by date range
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : null;
            let end = null;
            if (endDate) {
                end = new Date(endDate);
                // Set end of day in UTC
                end.setUTCHours(23, 59, 59, 999);
                console.log("End of day (UTC):", end.toISOString());
            }
            console.log(start, end, endDate, typeof endDate);
            events = events.filter(event => {
                const eventDate = new Date(event.eventStart);
                if (start && end)
                    return eventDate >= start && eventDate <= end;
                if (start)
                    return eventDate >= start;
                if (end)
                    return eventDate <= end;
                return true;
            });
        }
        if (userId) {
            let savedEvents = yield models_1.Models.SavedEvents.findAll({
                attributes: ["eventId"],
                where: { userId: userId },
                raw: true, // ensures plain objects instead of Sequelize instances
            });
            let savedEventIds = savedEvents.map(e => e.eventId);
            let savedSet = new Set(savedEventIds);
            // Mutate the same array
            events.forEach(event => {
                event.isSaved = savedSet.has(event.eventid);
            });
        }
        // === PAGINATION ===
        const pageNum = Number(page);
        const pageSize = Number(perPage);
        const total = events.length;
        const totalPages = Math.ceil(total / pageSize);
        const paginatedEvents = events.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        return h.response({
            message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY"),
            responseData: paginatedEvents,
            pagination: {
                total,
                page: pageNum,
                perPage: pageSize,
                totalPages
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.listAllEvents = listAllEvents;
const pastEvents = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query parameters for filtering and pagination
        const userId = request.auth.credentials.userData.id;
        const { name, startDate, endDate, page = 1, perPage = 20 } = request.query;
        // Default: only past events
        const now = new Date();
        if (startDate > now || endDate > now) {
            return Common.generateError(request, 400, 'DATES_ARE_NOT_FROM_PAST', {});
        }
        let where = {
            startDate: { [dbImporter_1.Op.lt]: now }, // event already started
        };
        if (name) {
            where = Object.assign(Object.assign({}, where), { name: { [dbImporter_1.Op.like]: `%${name}%` } }); // Use Op.like if DB is MySQL
        }
        // Search by date range
        const start = startDate ? new Date(startDate) : null;
        let end = null;
        if (endDate) {
            end = new Date(endDate);
            // Set end of day in UTC
            end.setUTCHours(23, 59, 59, 999);
            console.log("End of day (UTC):", end.toISOString());
        }
        if (startDate || endDate) {
            where = Object.assign(Object.assign({}, where), { startDate: { [dbImporter_1.Op.gte]: start } });
            where = Object.assign(Object.assign({}, where), { startDate: { [dbImporter_1.Op.lte]: end } });
        }
        else if (startDate) {
            where = Object.assign(Object.assign({}, where), { startDate: { [dbImporter_1.Op.gte]: start } });
        }
        else if (endDate) {
            where = Object.assign(Object.assign({}, where), { startDate: { [dbImporter_1.Op.lte]: end } });
        }
        const response = yield models_1.Models.Events.findAll({ where: where, order: [["startDate", "DESC"]], });
        let events = response;
        if (userId) {
            let savedEvents = yield models_1.Models.SavedEvents.findAll({
                attributes: ["eventId"],
                where: { userId: userId },
                raw: true, // ensures plain objects instead of Sequelize instances
            });
            let savedEventIds = savedEvents.map(e => e.eventId);
            let savedSet = new Set(savedEventIds);
            // Mutate the same array
            events.forEach(event => {
                event.isSaved = savedSet.has(event.eventid);
            });
        }
        // === PAGINATION ===
        const pageNum = Number(page);
        const pageSize = Number(perPage);
        const total = events.length;
        const totalPages = Math.ceil(total / pageSize);
        const paginatedEvents = events.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        return h.response({
            message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY"),
            responseData: paginatedEvents,
            pagination: {
                total,
                page: pageNum,
                perPage: pageSize,
                totalPages
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.pastEvents = pastEvents;
const savedEventsList = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query parameters for filtering and pagination
        const userId = request.auth.credentials.userData.id;
        const { name, startDate, endDate, page = 1, perPage = 20 } = request.query;
        let where = {
            userId: userId
        };
        if (name) {
            where = Object.assign(Object.assign({}, where), { name: { [dbImporter_1.Op.like]: `%${name}%` } }); // Use Op.like if DB is MySQL
        }
        // Search by date range
        const start = startDate ? new Date(startDate) : null;
        let end = null;
        if (endDate) {
            end = new Date(endDate);
            // Set end of day in UTC
            end.setUTCHours(23, 59, 59, 999);
            console.log("End of day (UTC):", end.toISOString());
        }
        if (startDate || endDate) {
            where = Object.assign(Object.assign({}, where), { startDate: { [dbImporter_1.Op.gte]: start } });
            where = Object.assign(Object.assign({}, where), { endDate: { [dbImporter_1.Op.lte]: end } });
        }
        else if (startDate) {
            where = Object.assign(Object.assign({}, where), { startDate: { [dbImporter_1.Op.gte]: start } });
        }
        else if (endDate) {
            where = Object.assign(Object.assign({}, where), { endDate: { [dbImporter_1.Op.lte]: end } });
        }
        const response = yield models_1.Models.SavedEvents.findAll({ where: where });
        let events = response;
        // === PAGINATION ===
        const pageNum = Number(page);
        const pageSize = Number(perPage);
        const total = events.length;
        const totalPages = Math.ceil(total / pageSize);
        const paginatedEvents = events.slice((pageNum - 1) * pageSize, pageNum * pageSize);
        return h.response({
            message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY"),
            responseData: paginatedEvents,
            pagination: {
                total,
                page: pageNum,
                perPage: pageSize,
                totalPages
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.savedEventsList = savedEventsList;
const savedEvent = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        // Query parameters for filtering and pagination
        const userId = request.auth.credentials.userData.id;
        let { eventMetaData } = request.payload;
        const { eventid, title, eventDate } = eventMetaData;
        const data = {
            eventId: eventid, name: title, startDate: eventDate, userId, eventMetaData: Object.assign(Object.assign({}, eventMetaData), { isSaved: true })
        };
        const response = yield models_1.Models.SavedEvents.create(data, { transaction });
        yield transaction.commit();
        return h.response({
            message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY")
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_FETCH_RECORDS', err);
    }
});
exports.savedEvent = savedEvent;
const unsavedEvent = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        // Query parameters for filtering and pagination
        const userId = request.auth.credentials.userData.id;
        const { eventId } = request.query;
        const eventDetails = yield models_1.Models.SavedEvents.findOne({ where: { eventId, userId } });
        if (!eventDetails) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_EVENT_ID', {});
        }
        yield models_1.Models.SavedEvents.destroy({ where: { eventId, userId }, transaction });
        yield models_1.Models.Notification.destroy({
            where: models_1.sequelize.literal(`
                 JSON_EXTRACT(notification_object, '$.id') = ${eventId}
            `),
            transaction
        });
        yield transaction.commit();
        return h.response({
            message: request.i18n.__("REQUEST_SUCCESSFULL")
        }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'FAILED_TO_SAVE_RECORDS', err);
    }
});
exports.unsavedEvent = unsavedEvent;
const eventListUpdate = () => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        // Fetch all events from the third-party API
        const response = yield axios_1.default.get(`https://prod-seetickets-core.seeticketsusa.us/api/v2/client/${process.env.SEE_TICKETS_CLIENT_ID}/event`, {
            headers: {
                "api-key": process.env.SEE_TICKETS_API_KEY || "",
                "api-secret": process.env.SEE_TICKETS_API_SECRET || "",
            },
        });
        let events = response.data;
        console.log('====================================');
        console.log("events");
        console.log('====================================');
        if (events.length > 0) {
            yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
                yield models_1.Models.Events.upsert({
                    eventId: event.eventid, // map API event ID to DB
                    name: event.title,
                    startDate: event.eventStart,
                    eventMetaData: event, // store full raw JSON if needed
                }, { transaction });
            })));
        }
        yield transaction.commit();
        return { success: true, message: "REQUEST_SUCCESSFULLY", data: {} };
    }
    catch (error) {
        yield transaction.rollback();
        console.log(error);
        return { success: false, message: "ERROR", data: {} };
    }
});
exports.eventListUpdate = eventListUpdate;
