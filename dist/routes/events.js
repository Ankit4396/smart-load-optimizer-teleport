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
const routeImporter_1 = require("../config/routeImporter");
const global_1 = require("../validators/global");
const events = __importStar(require("../controllers/event"));
const event_1 = require("../validators/event");
module.exports = [
    {
        method: "GET",
        path: "/events",
        handler: events.listAllEvents,
        options: {
            tags: ["api", "Events"],
            notes: "Endpoint to list events",
            description: "List events",
            auth: { strategies: ['jwt'], mode: 'optional' },
            validate: {
                headers: global_1.optional_authorizedheaders,
                options: global_1.options,
                query: event_1.listEventRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    }, {
        method: "GET",
        path: "/events/pasts",
        handler: events.pastEvents,
        options: {
            tags: ["api", "Events"],
            notes: "Endpoint to list past events",
            description: "List past events",
            auth: { strategies: ['jwt'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: event_1.listEventRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "GET",
        path: "/events/savedList",
        handler: events.savedEventsList,
        options: {
            tags: ["api", "Events"],
            notes: "Endpoint to list saved events",
            description: "List saved events",
            auth: { strategies: ['jwt'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: event_1.listEventRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    }, {
        method: "POST",
        path: "/events/save-event",
        handler: events.savedEvent,
        options: {
            tags: ["api", "Events"],
            notes: "Endpoint to save event",
            description: "save events",
            auth: { strategies: ['jwt'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: event_1.saveEventRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
    {
        method: "DELETE",
        path: "/events/unsaved-event",
        handler: events.unsavedEvent,
        options: {
            tags: ["api", "Events"],
            notes: "Endpoint to unsave event",
            description: "unsave events",
            auth: { strategies: ['jwt'] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: event_1.unsaveEventRequest,
                failAction: (req, h, err) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(err, req);
                }),
                validator: global_1.validator
            }
        }
    },
];
