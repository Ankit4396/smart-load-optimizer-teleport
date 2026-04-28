"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Sequelize = exports.Models = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const { DB_NAME, DB_USER_NAME, DB_PASSWORD, DB_HOST } = require(__dirname + '/../config/config')[process.env.NODE_ENV];
var sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER_NAME, DB_PASSWORD, {
    define: {
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci"
    },
    host: DB_HOST,
    dialect: process.env.MYSQL_DIALECT,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
    port: +process.env.MYSQL_PORT,
    pool: {
        max: +process.env.DB_POOL_MAX,
        min: +process.env.DB_POOL_MIN,
        acquire: +process.env.DB_POOL_ACQUIRE,
        idle: +process.env.DB_POOL_IDLE
    }
});
exports.sequelize = sequelize;
const Attachment_1 = __importDefault(require("./Attachment"));
const Language_1 = __importDefault(require("./Language"));
const AppVersion_1 = __importDefault(require("./AppVersion"));
const User_1 = __importDefault(require("./User"));
const UserProfile_1 = __importDefault(require("./UserProfile"));
const UserAccount_1 = __importDefault(require("./UserAccount"));
const UserSession_1 = __importDefault(require("./UserSession"));
const Role_1 = __importDefault(require("./Role"));
const RoleContent_1 = __importDefault(require("./RoleContent"));
const Permission_1 = __importDefault(require("./Permission"));
const PermissionContent_1 = __importDefault(require("./PermissionContent"));
const Token_1 = __importDefault(require("./Token"));
const EmailTemplate_1 = __importDefault(require("./EmailTemplate"));
const EmailTemplateContent_1 = __importDefault(require("./EmailTemplateContent"));
const Notification_1 = __importDefault(require("./Notification"));
const NotificationTemplate_1 = __importDefault(require("./NotificationTemplate"));
const NotificationTemplateContent_1 = __importDefault(require("./NotificationTemplateContent"));
const Address_1 = __importDefault(require("./Address"));
const CategoryType_1 = __importDefault(require("./CategoryType"));
const CategoryTypeContent_1 = __importDefault(require("./CategoryTypeContent"));
const Category_1 = __importDefault(require("./Category"));
const CategoryContent_1 = __importDefault(require("./CategoryContent"));
const Faq_1 = __importDefault(require("./Faq"));
const FaqContent_1 = __importDefault(require("./FaqContent"));
const Post_1 = __importDefault(require("./Post"));
const PostContent_1 = __importDefault(require("./PostContent"));
const PostMedia_1 = __importDefault(require("./PostMedia"));
const AttributeOption_1 = __importDefault(require("./AttributeOption"));
const AttributeOptionContent_1 = __importDefault(require("./AttributeOptionContent"));
const Attribute_1 = __importDefault(require("./Attribute"));
const AttributeContent_1 = __importDefault(require("./AttributeContent"));
const LostAndFound_1 = __importDefault(require("./LostAndFound"));
const Inquiry_1 = __importDefault(require("./Inquiry"));
const SupportTicket_1 = __importDefault(require("./SupportTicket"));
const SupportMessage_1 = __importDefault(require("./SupportMessage"));
const Events_1 = __importDefault(require("./Events"));
const SavedEvents_1 = __importDefault(require("./SavedEvents"));
const Gallery_1 = __importDefault(require("./Gallery"));
const Album_1 = __importDefault(require("./Album"));
const GalleryReport_1 = __importDefault(require("./GalleryReport"));
User_1.default.hasMany(UserAccount_1.default, { foreignKey: "userId", as: "userAccounts", onDelete: "cascade", onUpdate: "cascade", hooks: true });
User_1.default.hasOne(UserAccount_1.default, { foreignKey: "userId", as: "userAccount" });
User_1.default.hasOne(UserProfile_1.default, { foreignKey: "userId", as: "userProfile", onDelete: 'cascade', onUpdate: "cascade", hooks: true });
Role_1.default.hasMany(RoleContent_1.default, { foreignKey: 'roleId', onDelete: "cascade", onUpdate: "cascade", hooks: true });
Role_1.default.hasOne(RoleContent_1.default, { foreignKey: 'roleId', as: 'content' });
Role_1.default.hasOne(RoleContent_1.default, { foreignKey: 'roleId', as: 'defaultContent' });
Permission_1.default.hasMany(PermissionContent_1.default, { foreignKey: 'permissionId', onDelete: "cascade", onUpdate: "cascade", hooks: true });
Permission_1.default.hasOne(PermissionContent_1.default, { foreignKey: 'permissionId', as: 'content' });
Permission_1.default.hasOne(PermissionContent_1.default, { foreignKey: 'permissionId', as: 'defaultContent' });
Category_1.default.hasMany(Category_1.default, { foreignKey: "parentId", onDelete: 'cascade', hooks: true, as: 'children' });
Category_1.default.hasMany(PermissionContent_1.default, { foreignKey: "categoryId", onDelete: 'cascade', hooks: true });
Category_1.default.hasMany(CategoryContent_1.default, { foreignKey: "categoryId", onDelete: 'cascade', hooks: true });
Category_1.default.hasOne(CategoryContent_1.default, { foreignKey: 'categoryId', as: 'content' });
Category_1.default.hasOne(CategoryContent_1.default, { foreignKey: 'categoryId', as: 'defaultContent' });
EmailTemplate_1.default.hasMany(EmailTemplateContent_1.default, { foreignKey: "EmailTemplateId", onDelete: 'cascade', hooks: true });
EmailTemplate_1.default.hasOne(EmailTemplateContent_1.default, { foreignKey: "EmailTemplateId", onDelete: 'cascade', hooks: true, as: "emailContent" });
EmailTemplate_1.default.hasOne(EmailTemplateContent_1.default, { foreignKey: "EmailTemplateId", onDelete: 'cascade', hooks: true, as: "content" });
EmailTemplate_1.default.hasOne(EmailTemplateContent_1.default, { foreignKey: "EmailTemplateId", onDelete: 'cascade', hooks: true, as: "defaultContent" });
NotificationTemplate_1.default.hasMany(NotificationTemplateContent_1.default, { foreignKey: "notificationTemplateId", onDelete: 'cascade', hooks: true });
NotificationTemplate_1.default.hasOne(NotificationTemplateContent_1.default, { foreignKey: "notificationTemplateId", onDelete: 'cascade', hooks: true, as: "content" });
NotificationTemplate_1.default.hasOne(NotificationTemplateContent_1.default, { foreignKey: "notificationTemplateId", onDelete: 'cascade', hooks: true, as: "defaultContent" });
CategoryType_1.default.hasMany(CategoryTypeContent_1.default, { foreignKey: "categorytypeId", onDelete: 'cascade', hooks: true });
CategoryType_1.default.hasOne(CategoryTypeContent_1.default, { foreignKey: 'categorytypeId', as: 'content' });
CategoryType_1.default.hasOne(CategoryTypeContent_1.default, { foreignKey: 'categorytypeId', as: 'defaultContent' });
Faq_1.default.hasMany(FaqContent_1.default, { foreignKey: "faqId", onDelete: 'cascade', hooks: true });
Faq_1.default.hasOne(FaqContent_1.default, { foreignKey: 'faqId', as: 'content' });
Faq_1.default.hasOne(FaqContent_1.default, { foreignKey: 'faqId', as: 'defaultContent' });
Post_1.default.hasMany(PostContent_1.default, { foreignKey: 'postId' });
Post_1.default.hasMany(PostMedia_1.default, { foreignKey: 'postId' });
Post_1.default.hasOne(PostMedia_1.default, { foreignKey: 'postId', as: 'postImage' });
Post_1.default.hasOne(PostMedia_1.default, { foreignKey: 'postId', as: 'postVideo' }),
    Post_1.default.hasOne(PostContent_1.default, { foreignKey: 'postId', as: 'content' });
Post_1.default.hasOne(PostContent_1.default, { foreignKey: 'postId', as: 'defaultContent' }),
    Faq_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
Faq_1.default.belongsTo(User_1.default, { foreignKey: 'lastUpdatedBy', as: 'updatedBy' });
Faq_1.default.belongsTo(Category_1.default, { foreignKey: 'categoryId', as: 'category' });
FaqContent_1.default.belongsTo(Faq_1.default, { foreignKey: "faqId" });
FaqContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
CategoryTypeContent_1.default.belongsTo(CategoryType_1.default, { foreignKey: "categorytypeId" });
CategoryTypeContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
CategoryType_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
CategoryType_1.default.belongsTo(User_1.default, { foreignKey: 'lastUpdatedBy', as: 'updatedBy' });
UserProfile_1.default.belongsTo(User_1.default, { foreignKey: 'userId' });
UserProfile_1.default.belongsTo(Attachment_1.default, { foreignKey: "attachmentId", as: 'profileAttachment' });
Role_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
Role_1.default.belongsTo(User_1.default, { foreignKey: 'lastUpdatedBy', as: 'updatedBy' });
RoleContent_1.default.belongsTo(Role_1.default, { foreignKey: "roleId" });
RoleContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
Permission_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
Permission_1.default.belongsTo(User_1.default, { foreignKey: 'lastUpdatedBy', as: 'updatedBy' });
PermissionContent_1.default.belongsTo(PermissionContent_1.default, { foreignKey: "permissionId" });
PermissionContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
Category_1.default.belongsTo(CategoryType_1.default, { foreignKey: "categorytypeId", as: 'categorytype' });
Category_1.default.belongsTo(Attachment_1.default, { foreignKey: 'imageId', as: "categoryImage" });
Category_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
Category_1.default.belongsTo(User_1.default, { foreignKey: 'lastUpdatedBy', as: 'updatedBy' });
Category_1.default.belongsTo(Category_1.default, { foreignKey: 'parentId', as: 'parent' }),
    CategoryContent_1.default.belongsTo(Category_1.default, { foreignKey: "categoryId" });
CategoryContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
EmailTemplate_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
EmailTemplate_1.default.belongsTo(User_1.default, { foreignKey: 'lastUpdatedBy', as: 'updatedBy' });
EmailTemplateContent_1.default.belongsTo(EmailTemplate_1.default, { foreignKey: "EmailTemplateId" });
EmailTemplateContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
EmailTemplateContent_1.default.belongsTo(EmailTemplate_1.default, { foreignKey: "EmailTemplateId" });
EmailTemplateContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
NotificationTemplateContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
Post_1.default.belongsTo(Category_1.default, { foreignKey: 'categoryId', as: 'category' });
Post_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'author' });
Post_1.default.belongsTo(User_1.default, { foreignKey: 'lastUpdatedBy', as: 'updatedBy' });
PostContent_1.default.belongsTo(Post_1.default, { foreignKey: "postId" });
PostContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
PostContent_1.default.belongsTo(Attachment_1.default, { foreignKey: "imageId", as: 'postImage' });
PostContent_1.default.belongsTo(Attachment_1.default, { foreignKey: "videoId", as: 'postVideo' });
PostMedia_1.default.belongsTo(Post_1.default, { foreignKey: "postId" });
PostMedia_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
PostMedia_1.default.belongsTo(Attachment_1.default, { foreignKey: "fileId" });
EmailTemplate_1.default.belongsToMany(Attachment_1.default, { through: 'email_templates_attachment', foreignKey: "EmailTemplateId", otherKey: "attachmentId" });
User_1.default.belongsToMany(Role_1.default, { through: "user_roles", foreignKey: "userId", otherKey: "roleId" });
User_1.default.belongsToMany(Role_1.default, { through: "user_roles", foreignKey: "userId", otherKey: "roleId", as: "conditional" });
Role_1.default.belongsToMany(User_1.default, { through: "user_roles", foreignKey: "roleId", otherKey: "userId" });
Role_1.default.belongsToMany(Permission_1.default, { through: "role_permissions", foreignKey: "roleId", otherKey: "permissionId" });
Permission_1.default.belongsToMany(Role_1.default, { through: "role_permissions", foreignKey: "permissionId", otherKey: "roleId" });
AttributeOption_1.default.hasMany(AttributeOptionContent_1.default, { foreignKey: "attributeOptionId", onDelete: "cascade", onUpdate: "cascade", hooks: true });
AttributeOption_1.default.hasOne(AttributeOptionContent_1.default, { foreignKey: "attributeOptionId", as: "content" });
AttributeOption_1.default.hasOne(AttributeOptionContent_1.default, { foreignKey: "attributeOptionId", as: "defaultContent" });
AttributeOptionContent_1.default.belongsTo(AttributeOption_1.default, { foreignKey: "attributeOptionId" });
AttributeOptionContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
Attribute_1.default.belongsToMany(Category_1.default, { through: "attribute_categories", foreignKey: "attributeId", otherKey: "categoryId" });
Category_1.default.belongsToMany(Attribute_1.default, { through: "attribute_categories", foreignKey: "categoryId", otherKey: "attributeId" });
Attribute_1.default.hasMany(AttributeContent_1.default, { foreignKey: "attributeId", onDelete: "cascade", onUpdate: "cascade", hooks: true });
Attribute_1.default.hasOne(AttributeContent_1.default, { foreignKey: "attributeId", as: "content" });
Attribute_1.default.hasOne(AttributeContent_1.default, { foreignKey: "attributeId", as: "defaultContent" });
Attribute_1.default.hasMany(AttributeOption_1.default, { foreignKey: "attributeId" });
AttributeContent_1.default.belongsTo(Language_1.default, { foreignKey: "languageId" });
SupportTicket_1.default.hasMany(SupportMessage_1.default, { foreignKey: 'supportTicketId', as: 'messages' });
SupportMessage_1.default.belongsTo(SupportTicket_1.default, { foreignKey: 'supportTicketId', as: 'ticket' });
Gallery_1.default.hasMany(GalleryReport_1.default, { foreignKey: "galleryId", as: "reports" });
GalleryReport_1.default.belongsTo(Gallery_1.default, { foreignKey: "galleryId", as: "gallery" });
let Models = {
    AppVersion: AppVersion_1.default,
    Attachment: Attachment_1.default,
    Language: Language_1.default,
    User: User_1.default,
    UserProfile: UserProfile_1.default,
    UserAccount: UserAccount_1.default,
    UserSession: UserSession_1.default,
    Permission: Permission_1.default,
    PermissionContent: PermissionContent_1.default,
    Role: Role_1.default,
    RoleContent: RoleContent_1.default,
    Token: Token_1.default,
    EmailTemplate: EmailTemplate_1.default,
    EmailTemplateContent: EmailTemplateContent_1.default,
    Address: Address_1.default,
    CategoryType: CategoryType_1.default,
    CategoryTypeContent: CategoryTypeContent_1.default,
    Category: Category_1.default,
    CategoryContent: CategoryContent_1.default,
    Faq: Faq_1.default,
    FaqContent: FaqContent_1.default,
    Post: Post_1.default,
    PostContent: PostContent_1.default,
    PostMedia: PostMedia_1.default,
    AttributeOption: AttributeOption_1.default,
    AttributeOptionContent: AttributeOptionContent_1.default,
    Notification: Notification_1.default,
    NotificationTemplate: NotificationTemplate_1.default,
    NotificationTemplateContent: NotificationTemplateContent_1.default,
    Attribute: Attribute_1.default,
    AttributeContent: AttributeContent_1.default,
    LostAndFound: LostAndFound_1.default,
    Inquiry: Inquiry_1.default,
    SupportTicket: SupportTicket_1.default,
    SupportMessage: SupportMessage_1.default,
    Events: Events_1.default,
    SavedEvents: SavedEvents_1.default,
    Gallery: Gallery_1.default,
    Album: Album_1.default,
    GalleryReport: GalleryReport_1.default
};
exports.Models = Models;
