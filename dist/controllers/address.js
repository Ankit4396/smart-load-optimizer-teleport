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
exports.deleteAddress = exports.fetchUserAddress = exports.fetchAddress = exports.updateAddress = exports.addAddress = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const addAddress = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const authUser = request.auth.credentials.userData.id;
        const accountId = request.auth.credentials.userData.accountId;
        const { name, mapAddress, address, city, state, zipCode, country, landmark, latitude, longitude, addressLine1, addressLine2, phone, countryCode, shopId, entityType, addressType, geoLocation } = request.payload;
        const createdAddress = yield models_1.Models.Address.create({
            mapAddress, address, city, state, zipCode, country, landmark, latitude, longitude, addressLine1, addressLine2, userId: authUser, name, phone, countryCode, shopId, entityType, addressType, accountId, geoLocation
        }, { transaction: transaction });
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: createdAddress }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.addAddress = addAddress;
const updateAddress = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const authUser = request.auth.credentials.userData.id;
        const { mapAddress, address, city, state, zipCode, country, landmark, latitude, longitude, addressLine1, addressLine2, name, phone, countryCode, shopId, entityType, addressType, geoLocation } = request.payload;
        const id = request.params.id;
        const addressInfo = yield models_1.Models.Address.findOne({ where: { id } });
        if (!addressInfo) {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ADDRESS_ID_PROVIDED', {});
        }
        let updatedObject = {};
        if (mapAddress !== null)
            updatedObject["mapAddress"] = mapAddress === "" ? null : mapAddress;
        if (address !== null)
            updatedObject["address"] = address === "" ? null : address;
        if (city !== null)
            updatedObject["city"] = city === "" ? null : city;
        if (state !== null)
            updatedObject["state"] = state === "" ? null : state;
        if (zipCode !== null)
            updatedObject["zipCode"] = zipCode === "" ? null : zipCode;
        if (country !== null)
            updatedObject["country"] = country === "" ? null : country;
        if (landmark !== null)
            updatedObject["landmark"] = landmark === "" ? null : landmark;
        if (latitude !== null)
            updatedObject["latitude"] = latitude === "" ? null : latitude;
        if (longitude !== null)
            updatedObject["longitude"] = longitude === "" ? null : longitude;
        if (addressLine1 !== null)
            updatedObject["addressLine1"] = addressLine1 === "" ? null : addressLine1;
        if (addressLine2 !== null)
            updatedObject["addressLine2"] = addressLine2 === "" ? null : addressLine2;
        if (name !== null)
            updatedObject["name"] = name === "" ? null : name;
        if (phone !== null)
            updatedObject["phone"] = phone === "" ? null : phone;
        if (countryCode !== null)
            updatedObject["countryCode"] = countryCode === "" ? null : countryCode;
        if (shopId !== null)
            updatedObject["shopId"] = shopId === "" ? null : shopId;
        if (entityType !== null)
            updatedObject["entityType"] = entityType === "" ? null : entityType;
        if (addressType !== null)
            updatedObject["addressType"] = addressType === "" ? null : addressType;
        if (geoLocation !== null)
            updatedObject["geoLocation"] = geoLocation === "" ? null : geoLocation;
        const updatedAddress = yield addressInfo.update(updatedObject, { transaction });
        yield transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: updatedAddress }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateAddress = updateAddress;
const fetchAddress = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUser = request.auth.credentials.userData.id;
        const id = request.params.id;
        const addressInfo = yield models_1.Models.Address.findOne({ where: { id } });
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: addressInfo }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.fetchAddress = fetchAddress;
const fetchUserAddress = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUser = request.auth.credentials.userData.id;
        let id = request.params.id;
        const { addressType, entityType, shopId } = request.query;
        if (id == null || id == undefined) {
            id = authUser;
        }
        let where = { userId: id };
        if (addressType !== null)
            where = Object.assign(Object.assign({}, where), { addressType });
        if (entityType !== null)
            where = Object.assign(Object.assign({}, where), { entityType });
        if (shopId !== null)
            where = Object.assign(Object.assign({}, where), { shopId });
        const addressInfo = yield models_1.Models.Address.findAll({ where: where, order: [["id", "DESC"]] });
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: addressInfo }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.fetchUserAddress = fetchUserAddress;
const deleteAddress = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        const authUser = request.auth.credentials.userData.id;
        const id = request.params.id;
        const addressInfo = yield models_1.Models.Address.findOne({ where: { id } });
        if (!addressInfo) {
            transaction.rollback();
            return Common.generateError(request, 400, 'INVALID_ADDRESS_ID_PROVIDED', {});
        }
        const deletedAddress = yield addressInfo.destroy({ transaction });
        transaction.commit();
        return h.response({ message: request.i18n.__("REQUEST_SUCCESSFULL"), responseData: deletedAddress }).code(200);
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deleteAddress = deleteAddress;
