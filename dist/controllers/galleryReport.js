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
exports.reportGalleryImage = exports.getGalleryReports = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const lodash_1 = __importDefault(require("lodash"));
const dbImporter_1 = require("../config/dbImporter");
const getGalleryReports = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { galleryId } = request.query;
        // Get current user data from token
        const currentUserId = (_c = (_b = (_a = request.auth) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.userData) === null || _c === void 0 ? void 0 : _c.id;
        const permissions = ((_f = (_e = (_d = request.auth) === null || _d === void 0 ? void 0 : _d.credentials) === null || _e === void 0 ? void 0 : _e.userData) === null || _f === void 0 ? void 0 : _f.permissions) || [];
        // Check if user is admin
        const isAdmin = permissions.includes("admin");
        // const isAdmin = Common.checkRole(currentUserId, 'admin');
        console.log("isAdmin:", isAdmin, "currentUserId:", currentUserId);
        console.log("request.auth", request.auth);
        if (galleryId) {
            const gallery = yield models_1.Models.Gallery.findByPk(galleryId);
            if (!gallery) {
                return Common.generateError(request, 404, "GALLERY_NOT_FOUND", {});
            }
            // Build where clause based on user role
            const whereClause = { galleryId };
            if (!isAdmin && currentUserId) {
                // Non-admin users can only see their own reports
                whereClause.userId = currentUserId;
            }
            const reports = yield models_1.Models.GalleryReport.findAll({
                where: whereClause,
                attributes: ["id", "userId", "reason", "reportedIp", "createdAt"],
                order: [["createdAt", "DESC"]],
            });
            return h.response({
                message: request.i18n.__("REPORTS_FETCHED_SUCCESSFULLY"),
                responseData: reports,
                totalReports: reports.length,
            }).code(200);
        }
        else {
            // Build where clause for total reports based on user role
            const whereClause = {};
            if (!isAdmin && currentUserId) {
                // Non-admin users can only see their own reports
                whereClause.userId = currentUserId;
            }
            const totalReports = yield models_1.Models.GalleryReport.count({
                where: whereClause
            });
            const reportsPerGallery = yield models_1.Models.GalleryReport.findAll({
                attributes: [
                    "galleryId",
                    [models_1.sequelize.fn("COUNT", models_1.sequelize.col("id")), "reportCount"],
                ],
                where: whereClause,
                group: ["galleryId"],
                raw: true,
            });
            // Fetch gallery details (link and photosetId) for each gallery with reports
            const galleryIds = reportsPerGallery.map((r) => r.galleryId);
            const galleryDetails = yield models_1.Models.Gallery.findAll({
                attributes: ["id", "link", "photosetId"],
                where: {
                    id: { [dbImporter_1.Op.in]: galleryIds }
                },
                raw: true
            });
            // Create a map of gallery details for quick lookup
            const galleryDetailsMap = lodash_1.default.keyBy(galleryDetails, 'id');
            // Merge gallery details with report counts
            const enrichedReportsPerGallery = reportsPerGallery.map((report) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, report), { link: ((_a = galleryDetailsMap[report.galleryId]) === null || _a === void 0 ? void 0 : _a.link) || null, photosetId: ((_b = galleryDetailsMap[report.galleryId]) === null || _b === void 0 ? void 0 : _b.photosetId) || null }));
            });
            return h.response({
                message: request.i18n.__("TOTAL_REPORTS_FETCHED"),
                totalReports,
                reportsPerGallery: enrichedReportsPerGallery,
            }).code(200);
        }
    }
    catch (err) {
        console.error("Error fetching gallery reports:", err);
        return Common.generateError(request, 500, "FAILED_TO_FETCH_REPORTS", err);
    }
});
exports.getGalleryReports = getGalleryReports;
const reportGalleryImage = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { galleryId, reason } = request.payload;
        // Logged-in user ID (nullable)
        const userId = (_d = (_c = (_b = (_a = request === null || request === void 0 ? void 0 : request.auth) === null || _a === void 0 ? void 0 : _a.credentials) === null || _b === void 0 ? void 0 : _b.userData) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null;
        // Get client IP (works behind proxies too)
        const reportedIp = request.headers["x-forwarded-for"] || request.info.remoteAddress;
        // Check if the gallery exists
        const gallery = yield models_1.Models.Gallery.findByPk(galleryId);
        if (!gallery) {
            return Common.generateError(request, 404, "GALLERY_NOT_FOUND", {});
        }
        // Prevent duplicate reports
        // Logic: 
        // - If user is logged in → limit by userId
        // - If anonymous → limit by IP
        const alreadyReported = yield models_1.Models.GalleryReport.findOne({
            where: userId
                ? { galleryId, userId } // logged-in user
                : { galleryId, userId: null, reportedIp } // anonymous user
        });
        if (alreadyReported) {
            return h.response({
                message: request.i18n.__("IMAGE_ALREADY_REPORTED"),
                responseData: {}
            }).code(200);
        }
        // Create the report
        yield models_1.Models.GalleryReport.create({
            galleryId,
            userId, // null for anonymous
            reason: reason || null,
            reportedIp
        });
        // Get updated report count
        const reportCount = yield models_1.Models.GalleryReport.count({
            where: { galleryId }
        });
        return h.response({
            message: request.i18n.__("IMAGE_REPORTED_SUCCESSFULLY"),
            responseData: { galleryId, reportCount }
        }).code(200);
    }
    catch (err) {
        console.error("Error reporting gallery image:", err);
        return Common.generateError(request, 500, "FAILED_TO_REPORT_IMAGE", err);
    }
});
exports.reportGalleryImage = reportGalleryImage;
