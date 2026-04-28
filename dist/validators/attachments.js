"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestWithIdIdentifier = exports.decryptDataRequest = exports.getSignedUrlResponse = exports.getSignedUrl = exports.requestWithIdentifier = exports.attachment = exports.uploadResponse = exports.uploadRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
const attachment = routeImporter_1.Joi.object().keys({
    id: routeImporter_1.Joi.number().example(1).description("Unique identifier for the file"),
    userId: routeImporter_1.Joi.number().example(1).allow(null).description("User who has uploaded the file"),
    accountId: routeImporter_1.Joi.number().example(1).allow(null).description("User account who has uploaded the file"),
    uniqueName: routeImporter_1.Joi.string().example('uniquename.ext').description("Unique name for the file"),
    fileName: routeImporter_1.Joi.string().example('originalName.ext').description("original file name"),
    extension: routeImporter_1.Joi.string().example('ext').description("extension of file name"),
    filePath: routeImporter_1.Joi.string().example('/path/to/file.ext').description("path at which file has been stored"),
    type: routeImporter_1.Joi.number().example(1).description("If file is stored in local file system or s3, 1=> local 2=> S3 bucket"),
    size: routeImporter_1.Joi.number().example(1024).description("Size of file in bytes"),
    status: routeImporter_1.Joi.number().example(0).description("If uploaded file has been utilized or not"),
    createdAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("creation date"),
    updatedAt: routeImporter_1.Joi.date().example("2023-01-02T12:18:55.000Z").description("last update date")
}).label('attachment').description("Attachment object");
exports.attachment = attachment;
const uploadRequest = routeImporter_1.Joi.object().keys({
    file: routeImporter_1.Joi.any().meta({ swaggerType: 'file' }).example("upload file").required().description('File to be uploaded on server')
}).label('upload-attachment').description("Request to upload a file on server");
exports.uploadRequest = uploadRequest;
const uploadResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: attachment
}).label('upload-response').description('Upload attachment response');
exports.uploadResponse = uploadResponse;
const getSignedUrl = routeImporter_1.Joi.object().keys({
    fileName: routeImporter_1.Joi.string().required().error(errors => {
        return routeImporter_1.Common.routeError(errors, 'FILE_NAME_IS_REQUIRED');
    }).description("Name of file required to be uploaded"),
    encryptDataFlag: routeImporter_1.Joi.boolean().default(false).example(false).optional().allow(null).description('If document is to be encrypted'),
    fileSize: routeImporter_1.Joi.number().optional().allow(null).default(0)
}).label("get-signed-url").description("Get signed url from server for S3 bucket");
exports.getSignedUrl = getSignedUrl;
const decryptDataRequest = routeImporter_1.Joi.object().keys({
    uniqueName: routeImporter_1.Joi.string().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FILE_NAME_IS_REQUIRED'); }).description("Unique name of file is required"),
}).label("decrypt-file-data").description("Get decryption data for encrypted file");
exports.decryptDataRequest = decryptDataRequest;
const getSignedUrlResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().example("Request status message").description("Message to confirm the operation"),
    responseData: routeImporter_1.Joi.object().keys({
        id: routeImporter_1.Joi.number(),
        signedUrl: routeImporter_1.Joi.string(),
        fileName: routeImporter_1.Joi.string(),
        uniqueName: routeImporter_1.Joi.string(),
        dataKey: routeImporter_1.Joi.object().keys().allow(null)
    }).label('signed-url-data').description("Signedurl Response")
}).label("signed-url").description("Signed url from server for S3 bucket");
exports.getSignedUrlResponse = getSignedUrlResponse;
const requestWithIdentifier = routeImporter_1.Joi.object().keys({
    uniqueName: routeImporter_1.Joi.string().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FILE_UNIQUE_NAME_IS_REQUIRED'); }).description("Unique name of file is required")
}).label("attachemnt-identifier").description("Request object to find a file");
exports.requestWithIdentifier = requestWithIdentifier;
const requestWithIdIdentifier = routeImporter_1.Joi.object().keys({
    attachmentId: routeImporter_1.Joi.string().required().error(errors => { return routeImporter_1.Common.routeError(errors, 'FILE_UNIQUE_NAME_IS_REQUIRED'); }).description("Unique name of file is required")
}).label("attachemnt-identifier").description("Request object to find a file");
exports.requestWithIdIdentifier = requestWithIdIdentifier;
