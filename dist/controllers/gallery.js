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
exports.listAll = exports.listAllGalleries = void 0;
const models_1 = require("../models");
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const Common = __importStar(require("./common"));
const dbImporter_1 = require("../config/dbImporter");
const approvedContent_1 = require("../config/approvedContent");
// npm install p-queue
const agent = new http_1.default.Agent({ keepAlive: true });
const CHUNK_SIZE = 500; // DB insert chunk size
const BATCH_SIZE = 5; // Number of photosets to fetch in parallel
const listAllGalleries = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let page = 1;
        let totalPages = 1;
        do {
            // Step 1: Fetch a page of photosets
            const response = yield axios_1.default.get(`https://www.flickr.com/services/rest/?user_id=${process.env.FLICKER_USER_ID}&method=flickr.photosets.getList&api_key=${process.env.FLICKER_API_KEY}&format=json&nojsoncallback=1`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
                }
            });
            const { photosets } = response.data;
            totalPages = photosets.pages;
            // Step 2: Process photosets in batches for manual concurrency
            for (let i = 0; i < photosets.photoset.length; i += BATCH_SIZE) {
                const batch = photosets.photoset.slice(i, i + BATCH_SIZE);
                yield Promise.all(batch.map((set) => __awaiter(void 0, void 0, void 0, function* () {
                    // Fetch photos for this photoset
                    const photosResponse = yield axios_1.default.get(`https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${process.env.FLICKER_API_KEY}&photoset_id=${set.id}&user_id=${process.env.FLICKER_USER_ID}&format=json&nojsoncallback=1`, {
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
                        }
                    });
                    const photos = photosResponse.data.photoset.photo;
                    // Insert photos into DB in chunks
                    const transaction = yield models_1.sequelize.transaction();
                    for (let j = 0; j < photos.length; j += CHUNK_SIZE) {
                        const chunk = photos.slice(j, j + CHUNK_SIZE).map((p) => ({
                            photosetId: set.id,
                            title: p.title,
                            link: `https://live.staticflickr.com/${p.server}/${p.id}_${p.secret}_b.jpg`,
                        }));
                        try {
                            yield models_1.Models.Gallery.bulkCreate(chunk, {
                                transaction,
                                updateOnDuplicate: ["link"] // Upsert if unique
                            });
                            yield transaction.commit();
                        }
                        catch (err) {
                            yield transaction.rollback();
                            console.error(`Failed to insert chunk for photoset ${set.id}:`, err);
                        }
                    }
                })));
            }
            page++;
        } while (page <= totalPages);
        console.log("All gallery records inserted/updated successfully.");
        return { success: true, message: "REQUEST_SUCCESSFULLY", data: {} };
    }
    catch (err) {
        console.error(err);
        return { success: false, message: "ERROR", data: {} };
    }
});
exports.listAllGalleries = listAllGalleries;
const listAll = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, perPage = 20, title, photosetId } = request.query;
        const pageNum = Number(page);
        const pageSize = Number(perPage);
        let where = {};
        if (photosetId) {
            where = { photosetId };
        }
        if (title) {
            where = Object.assign(Object.assign({}, where), { title: { [dbImporter_1.Op.like]: `%${title}%` } }); // Use Op.like if DB is MySQL
        }
        // Check if there's a gallery limit for the specified photoset
        let galleryLimit = null;
        if (photosetId && approvedContent_1.ENABLE_CONTENT_FILTER) {
            galleryLimit = (0, approvedContent_1.getGalleryLimitForAlbum)(photosetId);
        }
        // Use DB-level pagination
        const { rows: gallery, count: total } = yield models_1.Models.Gallery.findAndCountAll({
            where,
            limit: pageSize,
            offset: (pageNum - 1) * pageSize,
            order: [["id", "ASC"]] // Order by ID to ensure consistent "first N" results
        });
        // Apply gallery limit if set
        let filteredGallery = gallery;
        let filteredTotal = total;
        if (galleryLimit !== null && photosetId) {
            // If gallery limit is set, we need to fetch all records up to the limit
            const allRecords = yield models_1.Models.Gallery.findAll({
                where,
                limit: galleryLimit,
                order: [["id", "ASC"]]
            });
            // Re-paginate the limited results
            const limitedTotal = allRecords.length;
            const limitedOffset = (pageNum - 1) * pageSize;
            filteredGallery = allRecords.slice(limitedOffset, limitedOffset + pageSize);
            filteredTotal = limitedTotal;
        }
        const totalPages = Math.ceil(filteredTotal / pageSize);
        return h.response({
            message: request.i18n.__("RECORDS_FETCHED_SUCCESSFULLY"),
            responseData: filteredGallery,
            pagination: {
                total: filteredTotal,
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
exports.listAll = listAll;
