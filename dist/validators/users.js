"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccountRequest = exports.updateUserSettings = exports.refreshTokenRequest = exports.createShopDocRequest = exports.approveAccountRequest = exports.resendCodeRequest = exports.changeMobileRequest = exports.updateUserProfileRequest = exports.changeStatusRequest = exports.socialLoginRequest = exports.updateSellerProfileRequest = exports.createSellerProfileRequest = exports.fetchUserListRequest = exports.changePasswordRequest = exports.resetPasswordRequest = exports.forgetPasswordRequest = exports.userResponse = exports.mobileLoginRequest = exports.loginRequest = exports.verifyTokenRequest = exports.otpResponse = exports.signupRequest = void 0;
const routeImporter_1 = require("../config/routeImporter");
// ######################################################################### request validator #########################################################################
const signupRequest = routeImporter_1.Joi.object().keys({
    email: routeImporter_1.Joi.string().trim().email().max(255).required()
        .example("email@domain.com")
        .description("User's email address for account creation")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL_ID'); }),
    password: routeImporter_1.Joi.string().trim().max(255).required()
        .example('password')
        .description("User's password for account security")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PASSWORD_IS_REQUIRED'); }),
    name: routeImporter_1.Joi.string().max(255).trim().required()
        .example('John Doe')
        .description("User's full name")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'NAME_IS_REQUIRED'); }),
    mobile: routeImporter_1.Joi.string().trim().required()
        .pattern(/^\d+$/)
        .example("1234567890")
        .description("The new mobile number associated with the account, which must contain only digits.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'MOBILE_IS_REQUIRED_AND_MUST_BE_NUMERIC'); }),
    countryCode: routeImporter_1.Joi.string().trim().required()
        .example("+1")
        .description("The country code associated with the new mobile number.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COUNTRY_CODE_IS_REQUIRED'); }),
    dob: routeImporter_1.Joi.string().trim().required()
        .example("1990-01-01")
        .description("Date of birth in YYYY-MM-DD format.")
        .error(errors => {
        return routeImporter_1.Common.routeError(errors, 'DOB_IS_REQUIRED');
    })
    // role: Joi.string().trim().required()
    //   .valid('user', 'seller')
    //   .example('user')
    //   .description("Code representing the user's role within the system")
    //   .error(errors => { return Common.routeError(errors, 'ROLE_IS_REQUIRED') })
}).label('signup-request')
    .description("Schema for validating user signup requests, including email, password, name, and role.");
exports.signupRequest = signupRequest;
const verifyTokenRequest = routeImporter_1.Joi.object().keys({
    token: routeImporter_1.Joi.string().trim().required()
        .example('otp_token_value')
        .description("The OTP token that was received after sending the OTP request")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'TOKEN_IS_REQUIRED'); }),
    code: routeImporter_1.Joi.string().trim().required()
        .example('9999')
        .description("The OTP code received by the user for verification")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CODE_IS_REQUIRED_AND_MUST_BE_NUMERIC'); })
}).label('verify-token-request')
    .description("Schema for validating the OTP verification request, including the token and the code received by the user.");
exports.verifyTokenRequest = verifyTokenRequest;
const resetPasswordRequest = routeImporter_1.Joi.object().keys({
    token: routeImporter_1.Joi.string().trim().required()
        .example('otp_token_value')
        .description("The OTP token received after requesting a password reset")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'TOKEN_IS_REQUIRED'); }),
    code: routeImporter_1.Joi.string().trim().required()
        .example('9999')
        .description("The OTP code received by the user for password reset verification")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CODE_IS_REQUIRED_AND_MUST_BE_NUMERIC'); }),
    password: routeImporter_1.Joi.string().trim().required()
        .example('new_password')
        .description("The new password for the account")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PASSWORD_IS_REQUIRED'); }),
}).label('reset-password-request')
    .description("Schema for validating the OTP verification and password reset request, including the token, code, and new password.");
exports.resetPasswordRequest = resetPasswordRequest;
const resendCodeRequest = routeImporter_1.Joi.object().keys({
    token: routeImporter_1.Joi.string().trim().required()
        .example('otp_token_value')
        .description("The OTP token received after requesting a password reset")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'TOKEN_IS_REQUIRED'); }),
}).label('resend-code-request')
    .description("Schema for validating the OTP verification and password reset request, including the token, code, and new password.");
exports.resendCodeRequest = resendCodeRequest;
const changePasswordRequest = routeImporter_1.Joi.object().keys({
    password: routeImporter_1.Joi.string().trim().required()
        .example('new_password')
        .description("The new password for the account")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PASSWORD_IS_REQUIRED'); }),
    oldPassword: routeImporter_1.Joi.string().trim().optional()
        .example('old_password')
        .description("The old password for the account, required if the account already has a set password")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'IF_ACCOUNT_HAS_OLD_PASSWORD'); }),
}).label('change-password-request')
    .description("Schema for validating the password change request, requiring the new password and optionally the old password.");
exports.changePasswordRequest = changePasswordRequest;
const loginRequest = routeImporter_1.Joi.object().keys({
    email: routeImporter_1.Joi.string().trim().email().required()
        .example("email@domain.com")
        .description("The user's email address for logging in")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL_ID'); }),
    password: routeImporter_1.Joi.string().trim().required()
        .example('password')
        .description("The user's password for logging in")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PASSWORD_IS_REQUIRED'); }),
}).label('login-request')
    .description("Schema for validating the login request, allowing for email and password or mobile number, country code, and password.");
exports.loginRequest = loginRequest;
const mobileLoginRequest = routeImporter_1.Joi.object({
    mobile: routeImporter_1.Joi.string().trim()
        .example("1234567890")
        .description("The user's mobile number for logging in")
        .error(errors => routeImporter_1.Common.routeError(errors, 'MOBILE_IS_REQUIRED')),
    countryCode: routeImporter_1.Joi.string().trim()
        .example("+91")
        .description("The country code for the mobile number")
        .error(errors => routeImporter_1.Common.routeError(errors, 'COUNTRY_CODE_IS_REQUIRED')),
    password: routeImporter_1.Joi.string().trim().required()
        .example("password")
        .description("The user's password for logging in")
        .error(errors => routeImporter_1.Common.routeError(errors, 'PASSWORD_IS_REQUIRED'))
});
exports.mobileLoginRequest = mobileLoginRequest;
const socialLoginRequest = routeImporter_1.Joi.object().keys({
    accessToken: routeImporter_1.Joi.string().trim().required()
        .example('abc123token')
        .description("The access token obtained from the social platform")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ACCESS_TOKEN_IS_REQUIRED'); }),
    name: routeImporter_1.Joi.string().trim().required()
        .example('John Doe')
        .description("The user's full name")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'NAME_IS_REQUIRED'); }),
    email: routeImporter_1.Joi.string().trim().email().required()
        .example('john.doe@example.com')
        .description("The user's email address")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    platform: routeImporter_1.Joi.string().trim().required().valid("google", "facebook", "apple")
        .example('google')
        .description("The social platform used for login (e.g., Google or Facebook or Apple)")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PLATFORM_IS_REQUIRED'); }),
}).label('social-login-request')
    .description("Schema for validating the social login request, including the access token, user's name, email, and the social platform used.");
exports.socialLoginRequest = socialLoginRequest;
const refreshTokenRequest = routeImporter_1.Joi.object().keys({
    refreshToken: routeImporter_1.Joi.string().trim().required()
        .example('abc123token')
        .description("The access token obtained from the social platform")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ACCESS_TOKEN_IS_REQUIRED'); })
}).label('srefresh-token-request')
    .description("Schema for validating the social login request, including the access token, user's name, email, and the social platform used.");
exports.refreshTokenRequest = refreshTokenRequest;
const changeStatusRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.number().valid(0, 1).required()
        .example(1)
        .description("The status value indicating the desired state, where 0 represents inactive and 1 represents active.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'STATUS_IS_REQUIRED'); }),
}).label('change-status-request')
    .description("Schema for validating the request to change the status, allowing only values 0 (inactive) and 1 (active).");
exports.changeStatusRequest = changeStatusRequest;
const approveAccountRequest = routeImporter_1.Joi.object().keys({
    status: routeImporter_1.Joi.number().valid(0, 1, 2, 3).required()
        .example(1)
        .description("The status value indicating the desired state, where 0 represents pending, 1 represents approved, and 2 represents rejected and 3 represents preapproved.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'STATUS_IS_REQUIRED'); }),
    comment: routeImporter_1.Joi.string().optional().default(null).allow(null)
        .example("Approval required from the manager.")
        .description("An optional comment related to the status change, such as reasons for pending approval or other remarks.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COMMENT_IS_INVALID'); }),
}).label('approve-account-request')
    .description("Schema for validating the request to change account status, including status and optional comments.");
exports.approveAccountRequest = approveAccountRequest;
const forgetPasswordRequest = routeImporter_1.Joi.object().keys({
    //   email: Joi.string().trim().email().required()
    //     .example("email@domain.com")
    //     .description("The email address associated with the account for password reset.")
    //     .error(errors => { return Common.routeError(errors, 'EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL_ID') }),
    mobile: routeImporter_1.Joi.string().trim().required()
        .pattern(/^\d+$/)
        .example("1234567890")
        .description("The new mobile number associated with the account, which must contain only digits.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'MOBILE_IS_REQUIRED_AND_MUST_BE_NUMERIC'); }),
    countryCode: routeImporter_1.Joi.string().trim().required()
        .example("+1")
        .description("The country code associated with the new mobile number.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COUNTRY_CODE_IS_REQUIRED'); }),
}).label('forgot-password-request')
    .description("Schema for validating a forget password request, requiring a valid email address.");
exports.forgetPasswordRequest = forgetPasswordRequest;
const changeMobileRequest = routeImporter_1.Joi.object().keys({
    mobile: routeImporter_1.Joi.string().trim().required()
        .pattern(/^\d+$/)
        .example("1234567890")
        .description("The new mobile number associated with the account, which must contain only digits.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'MOBILE_IS_REQUIRED_AND_MUST_BE_NUMERIC'); }),
    countryCode: routeImporter_1.Joi.string().trim().required()
        .example("+1")
        .description("The country code associated with the new mobile number.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COUNTRY_CODE_IS_REQUIRED'); }),
}).label('change-mobile-request')
    .description("Schema for validating a request to change the mobile number, requiring both the mobile number (which must be numeric) and country code.");
exports.changeMobileRequest = changeMobileRequest;
const fetchUserListRequest = routeImporter_1.Joi.object().keys({
    searchText: routeImporter_1.Joi.string().trim().optional()
        .example('John Doe')
        .description("Optional text to search and filter users by name")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SEARCH_TEXT_MUST_BE_STRING'); }),
    page: routeImporter_1.Joi.number().integer().optional().default(1)
        .example(1)
        .description("Optional page number for pagination, default is 1")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PAGE_NUMBER_MUST_BE_INTEGER'); }),
    perPage: routeImporter_1.Joi.number().integer().optional().default(20)
        .example(20)
        .description("Optional number of users per page, default is 20")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PER_PAGE_MUST_BE_INTEGER'); }),
    sortParameter: routeImporter_1.Joi.string().trim().optional().valid("id", "createdAt", "updatedAt").default("id")
        .example('id')
        .description("Optional parameter to sort users by, default is 'id'")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SORT_PARAMETER_MUST_BE_STRING'); }),
    sortValue: routeImporter_1.Joi.string().trim().optional().valid("asc", "desc").default("desc")
        .example('desc')
        .description("Optional sort order, can be 'asc' or 'desc', default is 'desc'")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SORT_VALUE_MUST_BE_STRING'); }),
    status: routeImporter_1.Joi.string().trim().optional().default(null)
        .example('active')
        .description("Optional filter to show users by their status")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'STATUS_MUST_BE_STRING'); }),
}).label('fetch-user-list-request')
    .description("Schema for validating the request to fetch a user list, including optional filters, pagination settings, sorting parameters, and status filters.");
exports.fetchUserListRequest = fetchUserListRequest;
const createSellerProfileRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().trim().required()
        .example('John Doe')
        .description("The name of the seller or entity")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'NAME_IS_REQUIRED'); }),
    contactEmail: routeImporter_1.Joi.string().trim().email().allow(null, "").optional().default(null)
        .example('john.doe@example.com')
        .description("The contact email address for the seller or entity")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    contactCountryCode: routeImporter_1.Joi.string().trim().required()
        .example('+1')
        .description("The contact email address for the seller or entity")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COUNTRY_CODE_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    contactPhone: routeImporter_1.Joi.string().trim().required()
        .example('1234567890')
        .description("The contact email address for the seller or entity")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_PHONE_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    storeUrl: routeImporter_1.Joi.string().trim().optional().allow(null, "").default(null)
        .example('https://www.example.com')
        .description("The URL of the seller's online store")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'STORE_URL_IS_REQUIRED_AND_MUST_BE_VALID_URL'); }),
    socialMediaLink: routeImporter_1.Joi.string().trim().optional().allow(null, "").default(null)
        .example('https://www.twitter.com/johndoe')
        .description("The URL to the seller's social media profile")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SOCIAL_MEDIA_LINK_IS_REQUIRED_AND_MUST_BE_VALID_URL'); }),
    attachmentId: routeImporter_1.Joi.number().optional()
        .example(1)
        .default(null)
        .description("Optional ID for any attachment related to the seller or entity")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTACHMENT_ID_MUST_BE_NUMBER'); }),
}).label('create-seller-profile-request')
    .description("Schema for creating a seller profile, including required fields such as name, contact email, store URL, and social media link, with an optional attachment ID.");
exports.createSellerProfileRequest = createSellerProfileRequest;
const updateSellerProfileRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example('John Doe')
        .description("The name of the seller or entity. Can be left null or an empty string if not updating")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'NAME_MUST_BE_STRING'); }),
    contactEmail: routeImporter_1.Joi.string().trim().email().optional().allow(null, "")
        .example('john.doe@example.com')
        .description("The contact email address for the seller or entity. Can be left null or an empty string if not updating")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_EMAIL_MUST_BE_VALID_EMAIL'); }),
    contactCountryCode: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example('+1')
        .description("The contact email address for the seller or entity")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COUNTRY_CODE_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    contactPhone: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example('1234567890')
        .description("The contact email address for the seller or entity")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_PHONE_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    storeUrl: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example('https://www.example.com')
        .description("The URL of the seller's online store. Can be left null or an empty string if not updating")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'STORE_URL_MUST_BE_VALID_URL'); }),
    socialMediaLink: routeImporter_1.Joi.string().trim().optional().allow(null, "")
        .example('https://www.twitter.com/johndoe')
        .description("The URL to the seller's social media profile. Can be left null or an empty string if not updating")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'SOCIAL_MEDIA_LINK_MUST_BE_VALID_URL'); }),
    attachmentId: routeImporter_1.Joi.number().optional().allow(null, "")
        .example(1)
        .default(null)
        .description("Optional ID for any attachment related to the seller or entity. Can be left null if not updating")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTACHMENT_ID_MUST_BE_NUMBER'); }),
}).label('update-seller-profile-request')
    .description("Schema for updating a seller profile with optional fields: name, contact email, store URL, social media link, and attachment ID.");
exports.updateSellerProfileRequest = updateSellerProfileRequest;
const updateUserProfileRequest = routeImporter_1.Joi.object().keys({
    name: routeImporter_1.Joi.string().max(255).trim().required()
        .example('John Doe')
        .description("The full name of the user or entity. Must be a non-empty string if provided.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'NAME_MUST_BE_STRING'); }),
    attachmentId: routeImporter_1.Joi.number().optional().allow(null, "")
        .example(1).default(null)
        .description("Optional ID for any attachment related to the user or entity. Can be null or an empty string if not applicable.")
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'ATTACHMENT_ID_MUST_BE_NUMBER'); }),
    dob: routeImporter_1.Joi.string().trim().required()
        .example("1990-01-01")
        .description("Date of birth in YYYY-MM-DD format.")
        .error(errors => {
        return routeImporter_1.Common.routeError(errors, 'DOB_IS_REQUIRED');
    })
}).label('update-user-profile-request')
    .description("Schema for updating a user profile, allowing optional fields: name and attachment ID.");
exports.updateUserProfileRequest = updateUserProfileRequest;
const updateUserSettings = routeImporter_1.Joi.object().keys({
    generalNotifications: routeImporter_1.Joi.boolean().required().example(true).description("General Notification"),
    paymentNotifications: routeImporter_1.Joi.boolean().required().example(true).description("Payment Notification"),
    reminderNotifications: routeImporter_1.Joi.boolean().required().example(true).description("Reminder Notification"),
}).label('update-user-settings')
    .description("Update user settings");
exports.updateUserSettings = updateUserSettings;
const createShopDocRequest = routeImporter_1.Joi.object().keys({
    businessName: routeImporter_1.Joi.string().trim().required()
        .example('Example Business')
        .description('The name of the business')
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'BUSINESS_NAME_IS_REQUIRED'); }),
    companyAddress: routeImporter_1.Joi.string().trim().required()
        .example('123 Example Street, Example City, EX 12345')
        .description('The address of the company')
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'COMPANY_ADDRESS_IS_REQUIRED'); }),
    phone: routeImporter_1.Joi.string().trim().required()
        .example('+1234567890')
        .description('The contact phone number of the business')
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'PHONE_IS_REQUIRED'); }),
    taxIdNumber: routeImporter_1.Joi.string().trim().required()
        .example('AB123456C')
        .description('The tax identification number of the business')
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'TAX_ID_NUMBER_IS_REQUIRED'); }),
    contactName: routeImporter_1.Joi.string().trim().required()
        .example('John Doe')
        .description('The name of the contact person for the business')
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_NAME_IS_REQUIRED'); }),
    contactEmail: routeImporter_1.Joi.string().trim().email().required()
        .example('contact@example.com')
        .description('The contact email address for the business')
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
    contactDirectDial: routeImporter_1.Joi.string().trim().required()
        .example('+0987654321')
        .description('The direct dial phone number for the contact person')
        .error(errors => { return routeImporter_1.Common.routeError(errors, 'CONTACT_DIRECT_DIAL_IS_REQUIRED'); }),
}).label('create-shop-doc-request')
    .description('Schema for creating a shop document request, including required fields such as business name, company address, phone number, tax ID number, contact name, contact email, and direct dial phone number.');
exports.createShopDocRequest = createShopDocRequest;
// ######################################################################### response validator #########################################################################
const userResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().trim().example("REQUEST_SUCCESSFULL").description("A message indicating the success of the request").error(errors => { return routeImporter_1.Common.routeError(errors, 'MESSAGE_IS_REQUIRED'); }),
    responseData: routeImporter_1.Joi.object().keys({
        id: routeImporter_1.Joi.number().integer().required().example(4).description("Unique identifier for the user").error(errors => { return routeImporter_1.Common.routeError(errors, 'ID_IS_REQUIRED'); }),
        accountId: routeImporter_1.Joi.number().integer().allow(null).example(null).description("Linked account identifier, if applicable"),
        email: routeImporter_1.Joi.string().trim().email().required().example("12345@domain.com").description("The user's email address").error(errors => { return routeImporter_1.Common.routeError(errors, 'EMAIL_IS_REQUIRED_AND_MUST_BE_VALID_EMAIL'); }),
        countryCode: routeImporter_1.Joi.string().trim().allow(null).example(null).description("Country code of the user's phone number"),
        mobile: routeImporter_1.Joi.string().trim().allow(null).example(null).description("The user's phone number"),
        createdAt: routeImporter_1.Joi.date().iso().allow(null).example(null).description("Timestamp of when the user record was created"),
        updatedAt: routeImporter_1.Joi.date().iso().allow(null).example(null).description("Timestamp of the last update to the user record"),
        status: routeImporter_1.Joi.number().integer().required().example(1).description("Current status of the user").error(errors => { return routeImporter_1.Common.routeError(errors, 'STATUS_IS_REQUIRED'); }),
        token: routeImporter_1.Joi.string().trim().allow(null).example(null).description("Authentication token for the user session"),
        refreshToken: routeImporter_1.Joi.string().trim().allow(null).example(null).description("Refresh token for the user session"),
        userProfile: routeImporter_1.Joi.object().keys({
            name: routeImporter_1.Joi.string().trim().allow(null).example(null).description("The full name of the user"),
            profileImage: routeImporter_1.Joi.string().trim().allow(null).example(null).description("URL or path to the user's profile image")
        }).required().description("Details of the user's profile").error(errors => { return routeImporter_1.Common.routeError(errors, 'USER_PROFILE_IS_REQUIRED'); }),
        sellerProfile: routeImporter_1.Joi.object().keys({
            id: routeImporter_1.Joi.number().integer().when('sellerProfile', { is: routeImporter_1.Joi.exist(), then: routeImporter_1.Joi.required() }).example(1).description("Unique identifier for the seller profile"),
            name: routeImporter_1.Joi.string().trim().when('sellerProfile', { is: routeImporter_1.Joi.exist(), then: routeImporter_1.Joi.required() }).example('Seller Name').description("Name of the seller profile"),
            contactEmail: routeImporter_1.Joi.string().trim().email().allow(null).example(null).description("Contact email of the seller"),
            contactCountryCode: routeImporter_1.Joi.string().trim().email().allow(null).example(null).description("Contact email of the seller"),
            contactPhone: routeImporter_1.Joi.string().trim().email().allow(null).example(null).description("Contact email of the seller"),
            storeUrl: routeImporter_1.Joi.string().trim().allow(null).example(null).description("Store URL of the seller"),
            socialMediaLink: routeImporter_1.Joi.string().trim().allow(null).example(null).description("Social media link of the seller"),
            hasSellerAccount: routeImporter_1.Joi.boolean().optional().example(true).description("Flag indicating if the seller has an account"),
            attachmentId: routeImporter_1.Joi.number().optional().allow(null).example(null).description("Attachment ID related to the seller profile"),
            isStripeConnected: routeImporter_1.Joi.boolean().when('sellerProfile', { is: routeImporter_1.Joi.exist(), then: routeImporter_1.Joi.required() }).example(false).description("Indicates if the seller's Stripe account is connected"),
            isVerifiedDocuments: routeImporter_1.Joi.boolean().when('sellerProfile', { is: routeImporter_1.Joi.exist(), then: routeImporter_1.Joi.required() }).example(false).description("Indicates if the seller's documents are verified"),
            isVerifiedProfile: routeImporter_1.Joi.boolean().when('sellerProfile', { is: routeImporter_1.Joi.exist(), then: routeImporter_1.Joi.required() }).example(false).description("Indicates if the seller's profile is verified"),
            status: routeImporter_1.Joi.number().integer().when('sellerProfile', { is: routeImporter_1.Joi.exist(), then: routeImporter_1.Joi.required() }).example(1).description("Current status of the seller profile")
        }).optional().allow(null),
        roles: routeImporter_1.Joi.array().items(routeImporter_1.Joi.object().keys({
            code: routeImporter_1.Joi.string().trim().example("user").description("Role code"),
            status: routeImporter_1.Joi.number().integer().example(1).description("Status of the role"),
            name: routeImporter_1.Joi.string().trim().example("User").description("Name of the role"),
            Permissions: routeImporter_1.Joi.array().items(routeImporter_1.Joi.string().trim().example("user").description("Permissions associated with this role"))
        })).required().description("Roles assigned to the user").error(errors => { return routeImporter_1.Common.routeError(errors, 'ROLES_ARE_REQUIRED'); }),
        permissions: routeImporter_1.Joi.array().items(routeImporter_1.Joi.string().trim().example("user").description("Additional permissions directly assigned to the user")).required().description("Direct permissions assigned to the user").error(errors => { return routeImporter_1.Common.routeError(errors, 'PERMISSIONS_ARE_REQUIRED'); })
    })
}).label('user-response').description("Response object containing details of the user including profile information, roles, and permissions");
exports.userResponse = userResponse;
const otpResponse = routeImporter_1.Joi.object().keys({
    message: routeImporter_1.Joi.string().trim().example("Success message from server").description("A message indicating the success of the OTP request").error(errors => { return routeImporter_1.Common.routeError(errors, 'MESSAGE_IS_REQUIRED'); }),
    responseData: routeImporter_1.Joi.object().keys({
        token: routeImporter_1.Joi.string().trim().required().example("your_token_here").description("OTP token generated for the request").error(errors => { return routeImporter_1.Common.routeError(errors, 'TOKEN_IS_REQUIRED'); })
    }).required().description("Contains the OTP token generated for the request")
}).label('otp-response').description("Response model for OTP request, including the generated token and success message");
exports.otpResponse = otpResponse;
const deleteUserAccountRequest = routeImporter_1.Joi.object({
    password: routeImporter_1.Joi.string().trim().required().description("Password"),
})
    .label("delete-account-request")
    .description("Request schema for aaccount delete operation");
exports.deleteUserAccountRequest = deleteUserAccountRequest;
