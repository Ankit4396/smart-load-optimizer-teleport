"use strict";
/**
 * Approved Content Configuration
 * This file contains whitelisted albums and galleries for Play Store compliance.
 * To disable content filtering, set ENABLE_CONTENT_FILTER to false.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApprovedPhotosetIds = exports.getGalleryLimitForAlbum = exports.APPROVED_ALBUMS = exports.ENABLE_CONTENT_FILTER = void 0;
// Enable/disable the content filter
exports.ENABLE_CONTENT_FILTER = true;
/**
 * Approved Albums Configuration
 * Define albums that can be displayed, and optional gallery limits per album
 */
exports.APPROVED_ALBUMS = [
    {
        id: 1,
        photosetId: "72177720331613225",
        title: "01/22/26 The HBIC Tour!",
        galleryLimit: null // Show all galleries from this album
    },
    {
        id: 2,
        photosetId: "72177720331613150",
        title: "01/22/26 Tiffany \"New York\" Pollard Meet & Greet",
        galleryLimit: null // Show all galleries from this album
    },
    {
        id: 4,
        photosetId: "72177720331638608",
        title: "01/17/26 MLK Massive w/ Angeria!",
        galleryLimit: 10 // Show first 10 galleries from this album
    },
    {
        id: 8,
        photosetId: "72177720331722905",
        title: "12/31/25 NYE Massive",
        galleryLimit: 14 // Show first 14 galleries from this album
    },
    {
        id: 18,
        photosetId: "72177720330017625",
        title: "10/30/25 Naughty & Ice Tour: Meredith Marks",
        galleryLimit: null // Show all galleries from this album
    }
];
/**
 * Get gallery limit for an album
 * @param photosetId - The photoset ID of the album
 * @returns The gallery limit, or null if no limit is set
 */
const getGalleryLimitForAlbum = (photosetId) => {
    var _a;
    if (!exports.ENABLE_CONTENT_FILTER)
        return null;
    const album = exports.APPROVED_ALBUMS.find(a => a.photosetId === photosetId);
    return (_a = album === null || album === void 0 ? void 0 : album.galleryLimit) !== null && _a !== void 0 ? _a : null;
};
exports.getGalleryLimitForAlbum = getGalleryLimitForAlbum;
/**
 * Get list of approved photoset IDs
 * @returns Array of approved photoset IDs
 */
const getApprovedPhotosetIds = () => {
    if (!exports.ENABLE_CONTENT_FILTER)
        return [];
    return exports.APPROVED_ALBUMS.map(a => a.photosetId);
};
exports.getApprovedPhotosetIds = getApprovedPhotosetIds;
