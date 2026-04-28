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
exports.updateStatus = exports.listPublicPost = exports.list = exports.deletePost = exports.update = exports.getBySlug = exports.get = exports.create = void 0;
const models_1 = require("../models");
const Common = __importStar(require("./common"));
const moment_1 = __importDefault(require("moment"));
const Constants = __importStar(require("../constants"));
const _ = __importStar(require("lodash"));
// Define all query attributes
const attributes = [
    'id', 'slug', 'status', 'isRevision', 'revisionId', 'createdAt', 'updatedAt',
    [models_1.sequelize.literal('(case when `content`.title is not null then `content`.title else `defaultContent`.title END)'), 'title'],
    [models_1.sequelize.literal('(case when `content`.description is not null then `content`.description else `defaultContent`.description END)'), 'description'],
    [models_1.sequelize.literal('(case when `content`.excerpt is not null then `content`.excerpt else `defaultContent`.excerpt END)'), 'excerpt']
];
const authorAttributes = [
    'id',
    [models_1.sequelize.literal('`author->userProfile`.`name`'), 'name'],
    [models_1.sequelize.literal('`author->userProfile->profileAttachment`.`unique_name`'), 'profileImage']
];
const updatedByAttributes = [
    'id',
    [models_1.sequelize.literal('`updatedBy->userProfile`.`name`'), 'name'],
    [models_1.sequelize.literal('`updatedBy->userProfile->profileAttachment`.`unique_name`'), 'profileImage']
];
const categoryAttributes = [
    'id', 'code',
    [models_1.sequelize.literal('(case when `category->content`.name is not null then `category->content`.name else `category->defaultContent`.name END)'), 'name'],
];
const mediaImageAttributes = [
    [models_1.sequelize.literal('`postImage`.`file_id`'), 'id'], [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`postImage->Attachment`.`unique_name`')), 'filePath']
];
const mediaVideoAttributes = [
    [models_1.sequelize.literal('`postVideo`.`file_id`'), 'id'], [models_1.sequelize.fn('CONCAT', process.env.BASE_URL, "/attachment/", models_1.sequelize.literal('`postVideo->Attachment`.`unique_name`')), 'filePath']
];
const fetch = (id, accountId, language) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield models_1.Models.Post.findOne({
        attributes: attributes,
        include: [
            {
                attributes: categoryAttributes,
                model: models_1.Models.Category,
                as: 'category',
                include: [
                    {
                        attributes: [],
                        model: models_1.Models.CategoryContent, as: 'content',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: language } }
                        ]
                    },
                    {
                        attributes: [],
                        model: models_1.Models.CategoryContent, as: 'defaultContent',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                        ]
                    }
                ]
            },
            {
                attributes: mediaImageAttributes,
                model: models_1.Models.PostMedia,
                as: 'postImage',
                where: { type: 'image' },
                required: false,
                include: [
                    { attributes: [], model: models_1.Models.Attachment },
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: mediaVideoAttributes,
                model: models_1.Models.PostMedia,
                as: 'postVideo',
                where: { type: 'video' },
                required: false,
                include: [
                    { attributes: [], model: models_1.Models.Attachment },
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.PostContent, as: 'content',
                include: [
                    { model: models_1.Models.Attachment, as: 'postImage' },
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.PostContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            },
            {
                model: models_1.Models.User,
                as: 'updatedBy',
                attributes: updatedByAttributes,
                include: [
                    {
                        model: models_1.Models.UserProfile,
                        attributes: [],
                        as: "userProfile",
                        include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                    }
                ]
            },
            {
                model: models_1.Models.User,
                as: 'author',
                attributes: authorAttributes,
                include: [
                    {
                        model: models_1.Models.UserProfile,
                        attributes: [],
                        as: "userProfile",
                        include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                    }
                ]
            }
        ],
        where: { id: id, accountId: accountId },
        subQuery: false,
    });
    return post;
});
const fetchBySlug = (slug, language) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield models_1.Models.Post.findOne({
        attributes: attributes,
        include: [
            {
                attributes: categoryAttributes,
                model: models_1.Models.Category,
                as: 'category',
                include: [
                    {
                        attributes: [],
                        model: models_1.Models.CategoryContent, as: 'content',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: language } }
                        ]
                    },
                    {
                        attributes: [],
                        model: models_1.Models.CategoryContent, as: 'defaultContent',
                        include: [
                            { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                        ]
                    }
                ]
            },
            {
                attributes: mediaImageAttributes,
                model: models_1.Models.PostMedia,
                as: 'postImage',
                where: { type: 'image' },
                required: false,
                include: [
                    { attributes: [], model: models_1.Models.Attachment },
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: mediaVideoAttributes,
                model: models_1.Models.PostMedia,
                as: 'postVideo',
                where: { type: 'video' },
                required: false,
                include: [
                    { attributes: [], model: models_1.Models.Attachment },
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.PostContent, as: 'content',
                include: [
                    { model: models_1.Models.Attachment, as: 'postImage' },
                    { attributes: [], model: models_1.Models.Language, where: { code: language } }
                ]
            },
            {
                attributes: [],
                model: models_1.Models.PostContent, as: 'defaultContent',
                include: [
                    { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                ]
            },
            {
                model: models_1.Models.User,
                as: 'updatedBy',
                attributes: updatedByAttributes,
                include: [
                    {
                        model: models_1.Models.UserProfile,
                        attributes: [],
                        as: "userProfile",
                        include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                    }
                ]
            },
            {
                model: models_1.Models.User,
                as: 'author',
                attributes: authorAttributes,
                include: [
                    {
                        model: models_1.Models.UserProfile,
                        attributes: [],
                        as: "userProfile",
                        include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                    }
                ]
            }
        ],
        where: { slug: slug },
        subQuery: false,
    });
    return post;
});
// Generate revision of category type prior to update and delete functions.
const storeRevision = (Object, transaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let revisonObject = JSON.parse(JSON.stringify(Object));
        let revisionId = revisonObject.id;
        revisonObject = _.omit(revisonObject, ['id']);
        revisonObject.isRevision = true;
        revisonObject.slug = revisonObject.slug + '-' + (0, moment_1.default)().toISOString();
        revisonObject.revisionId = revisionId;
        for (const key in revisonObject.PostContents) {
            revisonObject.PostContents[key] = _.omit(revisonObject.PostContents[key], ['id', 'postId']);
        }
        let revision = yield models_1.Models.Post.create(revisonObject, { include: [{ model: models_1.Models.PostContent }], transaction: transaction });
        if (revision)
            return revision;
        else
            return false;
    }
    catch (err) {
        return false;
    }
});
const create = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { title, description, excerpt, imageId, videoId, categoryId, postType } = request.payload;
        let titleText = yield Common.convertHtmlToText(title);
        let descriptionText = yield Common.convertHtmlToText(description);
        let excerptText = yield Common.convertHtmlToText(excerpt);
        let slug = yield Common.slugify(titleText);
        let PostContents = [];
        let postMedias = [];
        let existingCase = yield models_1.Models.Post.findOne({ where: { slug: slug, categoryId: categoryId, accountId: accountId } });
        let defaultLanguage = yield models_1.Models.Language.findOne({ where: { 'code': process.env.DEFAULT_LANGUAGE_CODE } });
        let language = request.headers.language;
        if (language != process.env.DEFAULT_LANGUAGE_CODE) {
            // create content in default language as user language is not default
            let requestedLanguage = yield models_1.Models.Language.findOne({ where: { 'code': request.header.language } });
            if (defaultLanguage && requestedLanguage) {
                //create category in default in requested language
                let defaultLanguageObject = {
                    title: title,
                    titleText: titleText,
                    description: description,
                    descriptionText: descriptionText,
                    excerpt: excerpt,
                    excerptText: excerptText,
                    languageId: defaultLanguage.id
                };
                let defaultImageMediaObject = {};
                let defaultVideoMediaObject = {};
                let requestedImageMediaObject = {};
                let requestedVideoMediaObject = {};
                if (imageId) {
                    defaultImageMediaObject = {
                        languageId: defaultLanguage.id,
                        fileId: imageId,
                        type: 'image',
                        isFeatured: true
                    };
                    requestedImageMediaObject = defaultImageMediaObject;
                    postMedias.push(defaultImageMediaObject, requestedImageMediaObject);
                }
                if (videoId) {
                    defaultVideoMediaObject = {
                        languageId: defaultLanguage.id,
                        fileId: videoId,
                        type: 'video',
                        isFeatured: true
                    };
                    requestedVideoMediaObject = defaultVideoMediaObject;
                    postMedias.push(defaultVideoMediaObject, requestedVideoMediaObject);
                }
                let requestedLanguageObject = {
                    title: title,
                    titleText: titleText,
                    description: description,
                    descriptionText: descriptionText,
                    excerpt: excerpt,
                    excerptText: excerptText,
                    imageId: imageId,
                    videoId: videoId,
                    languageId: requestedLanguage.id
                };
                PostContents.push(defaultLanguageObject, requestedLanguageObject);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_FETCHING_REQUIRED_LANGUAGE_FOR_CONTENT_CREATION', {});
            }
        }
        else {
            let defaultImageMediaObject = {};
            let defaultVideoMediaObject = {};
            if (imageId) {
                defaultImageMediaObject = {
                    languageId: defaultLanguage.id,
                    fileId: imageId,
                    type: 'image',
                    isFeatured: true
                };
                postMedias.push(defaultImageMediaObject);
            }
            if (videoId) {
                defaultVideoMediaObject = {
                    languageId: defaultLanguage.id,
                    fileId: videoId,
                    type: 'video',
                    isFeatured: true
                };
                postMedias.push(defaultVideoMediaObject);
            }
            let defaultLanguageObject = {
                title: title,
                titleText: titleText,
                description: description,
                descriptionText: descriptionText,
                excerpt: excerpt,
                excerptText: excerptText,
                imageId: imageId,
                videoId: videoId,
                languageId: defaultLanguage.id
            };
            PostContents.push(defaultLanguageObject);
        }
        if (!existingCase) {
            let post = yield models_1.Models.Post.create({
                slug: slug,
                categoryId: categoryId,
                postType: postType,
                userId: userId,
                accountId: accountId,
                lastUpdatedBy: null,
                status: Constants.STATUS.ACTIVE,
                PostContents: PostContents,
                PostMedia: postMedias
            }, {
                include: [
                    { model: models_1.Models.PostContent },
                    { model: models_1.Models.PostMedia }
                ],
                transaction: transaction
            });
            if (post) {
                yield transaction.commit();
                let returnObject = yield fetch(post.id, accountId, request.headers.language);
                returnObject = JSON.parse(JSON.stringify(returnObject));
                return h.response({ message: request.i18n.__("POST_CREATED_SUCCESSFULLY"), responseData: returnObject }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_POST', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'POST_WITH_TITLE_ALREADY_IN_USE', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.create = create;
// get a post by id
const get = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let post = yield fetch(id, accountId, request.headers.language);
        if (post) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(post)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'POST_DOES_NOT_EXISTS', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.get = get;
// get a post by slug
const getBySlug = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { slug } = request.params;
        let post = yield fetchBySlug(slug, request.headers.language);
        if (post) {
            return h.response({ message: request.i18n.__("REQUEST_PROCESSED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(post)) }).code(200);
        }
        else {
            return Common.generateError(request, 400, 'POST_DOES_NOT_EXISTS', {});
        }
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.getBySlug = getBySlug;
// update a Post 
const update = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { title, description, excerpt, imageId, videoId, categoryId, postType } = request.payload;
        let post = yield models_1.Models.Post.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.PostContent
                },
                {
                    model: models_1.Models.PostMedia
                }
            ]
        });
        if (post) {
            let revisonObject = JSON.parse(JSON.stringify(post));
            let revision = yield storeRevision(revisonObject, transaction);
            if (revision) {
                let titleText = yield Common.convertHtmlToText(title);
                let descriptionText = yield Common.convertHtmlToText(description);
                let excerptText = yield Common.convertHtmlToText(excerpt);
                yield models_1.Models.Post.update({ lastUpdatedBy: userId, categoryId: categoryId }, { where: { id: post.id }, transaction: transaction });
                let requestedLanguageId = yield models_1.Models.Language.findOne({ where: { code: request.headers.language } });
                const existingContent = post.PostContents.find((content) => content.languageId == (requestedLanguageId === null || requestedLanguageId === void 0 ? void 0 : requestedLanguageId.id));
                if (existingContent) {
                    let updatedContent = {};
                    updatedContent['title'] = title;
                    updatedContent['titleText'] = titleText;
                    updatedContent['description'] = description;
                    updatedContent['descriptionText'] = descriptionText;
                    updatedContent['excerpt'] = excerptText;
                    yield models_1.Models.PostContent.update(updatedContent, { where: { id: existingContent.id }, transaction: transaction });
                }
                else {
                    let newContent = {};
                    newContent.title = title;
                    newContent.titleText = titleText;
                    newContent.description = description;
                    newContent.descritpionText = descriptionText;
                    newContent.excerpt = excerpt;
                    newContent.excerptText = excerptText;
                    newContent.postId = post.id;
                    newContent.languageId = requestedLanguageId.id;
                    yield models_1.Models.PostContent.create(newContent, { transaction: transaction });
                }
                yield models_1.Models.PostMedia.destroy({ where: { postId: id }, transaction: transaction });
                if (imageId) {
                    yield models_1.Models.PostMedia.create({ languageId: requestedLanguageId.id, fileId: imageId, postId: id, isFeatured: true, type: 'image' }, { transaction: transaction });
                }
                if (videoId) {
                    yield models_1.Models.PostMedia.create({ languageId: requestedLanguageId.id, fileId: videoId, postId: id, isFeatured: true, type: 'video' }, { transaction: transaction });
                }
                yield transaction.commit();
                let responseObject = yield fetch(id, accountId, request.headers.language);
                responseObject = JSON.parse(JSON.stringify(responseObject));
                return h.response({ message: request.i18n.__("POST_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_REVISION', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'POST_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.update = update;
const deletePost = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let accountId = request.auth.credentials.userData.accountId;
        let post = yield models_1.Models.Post.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.PostContent
                }
            ]
        });
        if (post) {
            let userId = request.auth.credentials.userData.id;
            let revisonObject = JSON.parse(JSON.stringify(post));
            let revision = yield storeRevision(revisonObject, transaction);
            if (revision) {
                yield models_1.Models.Post.update({ lastUpdatedBy: userId }, { where: { id: post.id } });
                yield post.destroy({ transaction: transaction });
                yield transaction.commit();
                return h.response({ message: request.i18n.__("POST_HAS_BEEN_DELETED_SUCCESSFULLY"), responseData: JSON.parse(JSON.stringify(post)) }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_REVISION', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'POST_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.deletePost = deletePost;
// List category with pagination 
const list = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page, postType } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let posts = yield models_1.Models.Post.findAndCountAll({
            attributes: attributes,
            include: [
                {
                    attributes: categoryAttributes,
                    model: models_1.Models.Category,
                    as: 'category',
                    include: [
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'content',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                            ]
                        },
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'defaultContent',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                            ]
                        }
                    ]
                },
                {
                    attributes: mediaImageAttributes,
                    model: models_1.Models.PostMedia,
                    as: 'postImage',
                    where: { type: 'image' },
                    required: false,
                    include: [
                        { attributes: [], model: models_1.Models.Attachment },
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: mediaVideoAttributes,
                    model: models_1.Models.PostMedia,
                    as: 'postVideo',
                    required: false,
                    where: { type: 'video' },
                    include: [
                        { attributes: [], model: models_1.Models.Attachment },
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.PostContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.PostContent, as: 'defaultContent',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                },
                {
                    model: models_1.Models.User,
                    as: 'updatedBy',
                    attributes: updatedByAttributes,
                    include: [
                        {
                            model: models_1.Models.UserProfile,
                            as: "userProfile",
                            attributes: [],
                            include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                        }
                    ]
                },
                {
                    model: models_1.Models.User,
                    as: 'author',
                    attributes: authorAttributes,
                    include: [
                        {
                            model: models_1.Models.UserProfile,
                            as: "userProfile",
                            attributes: [],
                            include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                        }
                    ]
                }
            ],
            order: [['id', 'desc']],
            where: { isRevision: false, postType: postType },
            offset: offset,
            limit: perPage,
            distinct: true,
            subQuery: false
        });
        const count = posts.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(posts.rows));
        return h.response({
            message: request.i18n.__("POST_LIST_REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalPages: totalPages,
                totalRecords: count
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.list = list;
// List category with pagination for public post 
const listPublicPost = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { perPage, page, postType } = request.query;
        perPage = +process.env.PAGINATION_LIMIT < perPage ? +process.env.PAGINATION_LIMIT : perPage;
        let offset = (page - 1) * perPage;
        let posts = yield models_1.Models.Post.findAndCountAll({
            attributes: attributes,
            include: [
                {
                    attributes: categoryAttributes,
                    model: models_1.Models.Category,
                    as: 'category',
                    include: [
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'content',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                            ]
                        },
                        {
                            attributes: [],
                            model: models_1.Models.CategoryContent, as: 'defaultContent',
                            include: [
                                { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                            ]
                        }
                    ]
                },
                {
                    attributes: mediaImageAttributes,
                    model: models_1.Models.PostMedia,
                    as: 'postImage',
                    where: { type: 'image' },
                    required: false,
                    include: [
                        { attributes: [], model: models_1.Models.Attachment },
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: mediaVideoAttributes,
                    model: models_1.Models.PostMedia,
                    as: 'postVideo',
                    required: false,
                    where: { type: 'video' },
                    include: [
                        { attributes: [], model: models_1.Models.Attachment },
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.PostContent, as: 'content',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: request.headers.language } }
                    ]
                },
                {
                    attributes: [],
                    model: models_1.Models.PostContent, as: 'defaultContent',
                    include: [
                        { attributes: [], model: models_1.Models.Language, where: { code: process.env.DEFAULT_LANGUAGE_CODE } }
                    ]
                },
                {
                    model: models_1.Models.User,
                    as: 'updatedBy',
                    attributes: updatedByAttributes,
                    include: [
                        {
                            model: models_1.Models.UserProfile,
                            as: "userProfile",
                            attributes: [],
                            include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                        }
                    ]
                },
                {
                    model: models_1.Models.User,
                    as: 'author',
                    attributes: authorAttributes,
                    include: [
                        {
                            model: models_1.Models.UserProfile,
                            as: "userProfile",
                            attributes: [],
                            include: [{ model: models_1.Models.Attachment, as: 'profileAttachment', attributes: [] }]
                        }
                    ]
                }
            ],
            order: [['id', 'desc']],
            where: { isRevision: false, postType: postType, status: Constants.STATUS.ACTIVE },
            offset: offset,
            limit: perPage,
            distinct: true,
            subQuery: false
        });
        const count = posts.count;
        let totalPages = yield Common.getTotalPages(count, perPage);
        let rows = JSON.parse(JSON.stringify(posts.rows));
        return h.response({
            message: request.i18n.__("POST_LIST_REQUEST_PROCESSED_SUCCESSFULLY"),
            responseData: {
                data: rows,
                perPage: perPage,
                page: page,
                totalPages: totalPages,
                totalRecords: count
            }
        }).code(200);
    }
    catch (err) {
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.listPublicPost = listPublicPost;
// update status of category
const updateStatus = (request, h) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield models_1.sequelize.transaction();
    try {
        let { id } = request.params;
        let userId = request.auth.credentials.userData.id;
        let accountId = request.auth.credentials.userData.accountId;
        let { status } = request.payload;
        let post = yield models_1.Models.Post.findOne({
            where: { id: id, isRevision: false, revisionId: null },
            include: [
                {
                    model: models_1.Models.PostContent
                }
            ]
        });
        if (post) {
            // Create revision of existing entity in DB
            let revisonObject = JSON.parse(JSON.stringify(post));
            let revision = yield storeRevision(revisonObject, transaction);
            if (revision) {
                yield models_1.Models.Post.update({ lastUpdatedBy: userId, status: status }, { where: { id: post.id }, transaction: transaction });
                yield transaction.commit();
                let responseObject = yield fetch(id, accountId, request.headers.language);
                responseObject = JSON.parse(JSON.stringify(responseObject));
                return h.response({ message: request.i18n.__("POST_STATUS_HAS_BEEN_UPDATED_SUCCESSFULLY"), responseData: responseObject }).code(200);
            }
            else {
                yield transaction.rollback();
                return Common.generateError(request, 400, 'ERROR_WHILE_CREATING_THE_REVISION', {});
            }
        }
        else {
            yield transaction.rollback();
            return Common.generateError(request, 400, 'POST_ID_NOT_FOUND', {});
        }
    }
    catch (err) {
        yield transaction.rollback();
        return Common.generateError(request, 500, 'SOMETHING_WENT_WRONG_WITH_EXCEPTION', err);
    }
});
exports.updateStatus = updateStatus;
