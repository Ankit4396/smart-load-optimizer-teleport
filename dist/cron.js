"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { eventListUpdate } = require("./controllers/event");
const { listAllGalleries } = require("./controllers/gallery");
const { listAllAlbums } = require("./controllers/album");
const { sendEventNotification, updateNotificationStatus, updateCustomNotificationStatus } = require("./controllers/notifications");
module.exports = [
    {
        name: 'eventListUpdate',
        time: '5 0 * * *',
        timezone: 'America/New_York',
        // time: '17 21 * * *',
        // timezone: 'Asia/Kolkata',
        request: {
            method: 'GET',
            url: '/cron/event-list-update'
        },
        onComplete: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('-----^^^^^^ Cron started ^^^^^^-----');
            yield eventListUpdate();
            console.log('-----^^^^^^ Cron ended ^^^^^^-----');
        })
    },
    {
        name: 'gallaryUpdate',
        time: '5 1 * * *',
        timezone: 'America/New_York',
        // time: '14 21 * * *',
        // timezone: 'Asia/Kolkata',
        request: {
            method: 'GET',
            url: '/cron/gallary-update'
        },
        onComplete: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('-----^^^^^^ Cron started ^^^^^^-----');
            yield listAllGalleries();
            console.log('-----^^^^^^ Cron ended ^^^^^^-----');
        })
    },
    {
        name: 'albumUpdate',
        time: '45 0 * * *',
        timezone: 'America/New_York',
        // time: '10 21 * * *',
        // timezone: 'Asia/Kolkata',
        request: {
            method: 'GET',
            url: '/cron/album-update'
        },
        onComplete: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('-----^^^^^^ Cron started ^^^^^^-----');
            yield listAllAlbums();
            console.log('-----^^^^^^ Cron ended ^^^^^^-----');
        })
    },
    // running manually 
    // {
    //     name: 'gallaryUpdate',
    //     time: '42 15 * * *',
    //     timezone: 'Asia/Kolkata',
    //     request: {
    //         method: 'GET',
    //         url: '/cron/gallary-update'
    //     },
    //     onComplete: async() => {
    //         console.log('-----^^^^^^ Cron started ^^^^^^-----');
    //         await listAllGalleries()
    //         console.log('-----^^^^^^ Cron ended ^^^^^^-----');
    //     }
    // },
    {
        name: 'sendEventNotification',
        time: '0 9 * * *',
        timezone: 'America/Los_Angeles', // PST/PDT timezone
        request: {
            method: 'GET',
            url: '/cron/sendEventNotification'
        },
        onComplete: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('-----^^^^^^ Cron started ^^^^^^-----');
            yield sendEventNotification();
            console.log('-----^^^^^^ Cron ended ^^^^^^-----');
        })
    },
    {
        name: 'updateNotificationStatus',
        time: '0 2 * * *',
        timezone: 'America/Los_Angeles', // PST/PDT timezone
        request: {
            method: 'GET',
            url: '/cron/updateNotificationStatus'
        },
        onComplete: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('-----^^^^^^ Cron started ^^^^^^-----');
            yield updateNotificationStatus();
            console.log('-----^^^^^^ Cron ended ^^^^^^-----');
        })
    },
    {
        name: 'updateCustomNotificationStatus',
        time: '0 2 * * *',
        timezone: 'America/Los_Angeles', // PST/PDT timezone
        request: {
            method: 'GET',
            url: '/cron/updateCustomNotificationStatus'
        },
        onComplete: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('-----^^^^^^ Cron for updateCustomNotificationStatus started ^^^^^^-----');
            yield updateCustomNotificationStatus();
            console.log('-----^^^^^^ Cron for updateCustomNotificationStatus ended ^^^^^^-----');
        })
    }
];
