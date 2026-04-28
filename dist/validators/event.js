"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveEventRequest = exports.saveEventRequest = exports.listEventRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
exports.listEventRequest = routeImporter_1.Joi.object({
    page: routeImporter_1.Joi.number().optional().min(1).default(1)
        .description("Pagination page number."),
    perPage: routeImporter_1.Joi.number().integer().optional().min(1).default(+process.env.PAGINATION_LIMIT)
        .description("Number of results per page."),
    name: routeImporter_1.Joi.string().optional().allow("", null).description("Search keyword"),
    startDate: routeImporter_1.Joi.date().optional().description("Start Date"),
    endDate: routeImporter_1.Joi.date().optional().description("End Date")
});
exports.saveEventRequest = routeImporter_1.Joi.object().keys({
    eventMetaData: routeImporter_1.Joi.object().required().example({ "eventMetaData": {
            "id": 663250,
            "title": "STUNT Labor Day Extravaganza",
            "subtitle": null,
            "header": null,
            "isMultiDays": false,
            "onSale": {
                "end": "2025-09-01T00:00:00.000Z"
            },
            "availableDeliveryMethods": [
                {
                    "id": 70,
                    "name": "Print@Home",
                    "isShipped": false,
                    "isUSAOnly": false,
                    "isCanadaOnly": false
                }
            ],
            "genre": "DJ/Dance",
            "datesTimes": {
                "date": "2025-08-31T21:00:00.000Z",
                "times": {
                    "doorTime": "9:00 PM",
                    "showTime": "2025-08-31T21:00:00.000Z",
                    "endTime": "2:00AM"
                }
            },
            "image": "https://prod-images.seetickets.us/eyJidWNrZXQiOiJwcm9kLXNpaC5zZWV0aWNrZXRzdXNhLnVzIiwia2V5IjoiMDZmMDRiOWYtMDVkNS00MWYxLTkzMDItM2JjMGE5NzdhNzg1IiwiZWRpdHMiOnt9fQ==",
            "image-sm": "https://prod-images.seetickets.us/eyJidWNrZXQiOiJwcm9kLXNpaC5zZWV0aWNrZXRzdXNhLnVzIiwia2V5IjoiMDZmMDRiOWYtMDVkNS00MWYxLTkzMDItM2JjMGE5NzdhNzg1IiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo2MDB9LCJqcGVnIjp7InF1YWxpdHkiOjYwfSwicG5nIjp7ImNvbXByZXNzaW9uTGV2ZWwiOjksInF1YWxpdHkiOjYwfSwid2VicCI6eyJxdWFsaXR5Ijo2MH19fQ==",
            "eventid": 663250,
            "eventheader": null,
            "eventsubtitle": null,
            "headliners": null,
            "talent": null,
            "eventday": "Sunday",
            "isPassEvent": false,
            "eventStart": "2025-08-31T21:00:00.000Z",
            "eventdate": "Sun Aug 31",
            "eventyear": "2025",
            "doortime": "9:00 PM",
            "eventtime": "9:00 PM",
            "utcEventDateTime": "2025-09-01T04:00:00.000Z",
            "ianaTimezone": "America/Los_Angeles",
            "endtime": "2:00AM",
            "onsale": null,
            "offsale": "09/01/2025 12AM ",
            "offsaleDateAndTime": "2025-09-01T00:00:00.000Z",
            "ticketSalesEnd": "2025-09-01T00:00:00.000Z",
            "publishDate": null,
            "age": null,
            "currency": "USD",
            "ticketpricerange": "$8.00",
            "minTicketPrice": "$8.00",
            "maxTicketPrice": "$8.00",
            "link": "https://wl.seetickets.us/event/stunt-labor-day-extravaganza/663250?afflky=RichsSanDiego",
            "status": "gettickets",
            "advancedStatus": "gettickets",
            "sortdate": "20250831",
            "venueid": 84524,
            "venue": "Rich's San Diego",
            "room": null,
            "address": "1051 University Ave",
            "city": "San Diego",
            "state": "CA",
            "organizers": "",
            "organizer": "",
            "lat": 32.74808120727539,
            "lng": -117.15406799316406,
            "eventCategory": "DJ/Dance",
            "tags": null,
            "wordpressStatus": "publish",
            "isUnlisted": false
        } }),
});
exports.unsaveEventRequest = routeImporter_1.Joi.object({
    eventId: routeImporter_1.Joi.number().required(),
});
