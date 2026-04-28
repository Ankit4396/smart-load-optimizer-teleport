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
const User = __importStar(require("../controllers/users"));
const users_1 = require("../validators/users");
const global_1 = require("../validators/global");
const isAuthorized = false;
module.exports = [
    {
        method: 'POST',
        path: '/user/signup',
        handler: User.signup,
        options: {
            tags: ["api", "User"],
            notes: "This endpoint registers a new user by accepting their details and sending a verification link to the provided email address.",
            description: "Endpoint for user registration.",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.signupRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/verify-token',
        handler: User.verifyToken,
        options: {
            tags: ["api", "User"],
            notes: "This endpoint allows users to verify if a token is valid or invalid, and if it is active or expired.",
            description: "Verify token",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.verifyTokenRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    // {
    //     method: 'POST',
    //     path: '/user/verify-email',
    //     handler: User.verifyEmail,
    //     options: {
    //         tags: ["api", "User"],
    //         notes: "This endpoint allows users to verify if a token is valid or invalid, and if it is active or expired. If the token is verified, it creates a user based on the information stored within it.",
    //         description: "Verify email",
    //         auth: false,
    //         validate: {
    //             headers: headers,
    //             options: options,
    //             payload: verifyTokenRequest,
    //             failAction: async (request: any, h: any, error: any) => {
    //                 return Common.FailureError(error, request);
    //             },
    //             validator: Joi
    //         },
    //         response: {
    //             status: {
    //                 // 200: userResponse,
    //                 400: resp400,
    //                 500: resp500
    //             }
    //         }
    //     }
    // },
    {
        method: 'POST',
        path: '/user/verify-code',
        handler: User.verifyCode,
        options: {
            tags: ["api", "User"],
            notes: "This endpoint allows users to verify if a token is valid or invalid, and if it is active or expired. If the token is verified, it creates a user based on the information stored within it.",
            description: "Verify email",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.verifyTokenRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/login',
        handler: User.login,
        options: {
            tags: ["api", "User"],
            notes: "Verifies the User based on email - password and provide the auth token with user details.",
            description: "User Login",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.loginRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/mobile/login',
        handler: User.login,
        options: {
            tags: ["api", "User"],
            notes: "Verifies the User based on mobile - password and provide the auth token with user details.",
            description: "User Login",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.mobileLoginRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/refresh-token',
        handler: User.refreshToken,
        options: {
            tags: ["api", "User"],
            notes: "Generates new auth token with the help of refresh token",
            description: "Refresh Token",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.refreshTokenRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/social-login',
        handler: User.socialLogin,
        options: {
            tags: ["api", "User"],
            notes: "Verifies the User based on social account and provide the auth token with user details.",
            description: "Social Login",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.socialLoginRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/forgot-password',
        handler: User.forgetPassword,
        options: {
            tags: ["api", "User"],
            notes: "Verifies the User based on email and initiates the forgot password process by sending a reset link or code.",
            description: "Forgot password",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.forgetPasswordRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/change-email',
        handler: User.requestChangeEmail,
        options: {
            tags: ["api", "User"],
            notes: "Initiates the process for changing the user's email address. Verifies the user based on JWT authentication and processes the request to update the email.",
            description: "Change Password",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: users_1.forgetPasswordRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/change-mobile',
        handler: User.requestChangeMobile,
        options: {
            tags: ["api", "User"],
            notes: "Initiates the process for changing the user's mobile number. Verifies the user based on JWT authentication and processes the request to update the mobile number.",
            description: "Change Mobile",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: users_1.changeMobileRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/resend-code',
        handler: User.resendCode,
        options: {
            tags: ["api", "User"],
            notes: "Verifies the User based on email and initiates the forgot password process by sending a reset link or code.",
            description: "Resend Code",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.resendCodeRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/user/reset-password',
        handler: User.resetPassword,
        options: {
            tags: ["api", "User"],
            notes: "Verifies the User based on email and initiates the forget password process by sending a reset link or code.",
            description: "Reset Password",
            auth: false,
            validate: {
                headers: global_1.headers,
                options: global_1.options,
                payload: users_1.resetPasswordRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/user/change-password',
        handler: User.changePassword,
        options: {
            tags: ["api", "User"],
            notes: "Allow verified user to change password after loggin in to the application.",
            description: "Change Password",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: users_1.changePasswordRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/users',
        handler: User.userslist,
        options: {
            tags: ["api", "User"],
            notes: "Retrieve a list of users by applying filters such as role and status. Include pagination and support custom sorting options to organize the results accordingly.",
            description: "List Users",
            auth: false,
            // auth: {strategy: "jwt"},
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                query: users_1.fetchUserListRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/profile',
        handler: User.usersProfile,
        options: {
            tags: ["api", "User"],
            notes: "To access the details of an authorized user, ensure that the request is accompanied by a valid authentication token.",
            description: "Authorized User Profile",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                //query: fetchUserListRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/{id}',
        handler: User.fetchUser,
        options: {
            tags: ["api", "User"],
            notes: "To list the details of an authorized user, the request must be made on behalf of another user, but only if accompanied by a valid authentication token.",
            description: "User Profile by id",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: global_1.identifierRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/user/update-profile',
        handler: User.updateUserProfile,
        options: {
            tags: ["api", "User"],
            notes: "Allows for modification of an existing user's details by providing the updated information.",
            description: "Update User Profile",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: users_1.updateUserProfileRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/user/update-settings',
        handler: User.updateUserSettings,
        options: {
            tags: ["api", "User"],
            notes: "User Settings update",
            description: "Update User settings",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: users_1.updateUserSettings,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/user/{id}/status',
        handler: User.changeStatus,
        options: {
            tags: ["api", "User"],
            notes: "Allow User to change the status of the account to active/inactive.",
            description: "Change Status",
            auth: { strategy: "jwt" },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                params: global_1.identifierRequest,
                payload: users_1.changeStatusRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi
            },
            response: {
                status: {
                    // 200: otpResponse,
                    400: global_1.resp400,
                    500: global_1.resp500
                }
            }
        }
    },
    {
        method: "DELETE",
        path: "/user/deleteUserAccount",
        handler: User.deleteUserAccount,
        options: {
            tags: ["api", "User"],
            notes: "Handles user account delete process",
            description: "Delete the user account",
            auth: { strategies: ["jwt"], scope: ["user"] },
            validate: {
                headers: global_1.authorizedheaders,
                options: global_1.options,
                payload: users_1.deleteUserAccountRequest,
                failAction: (request, h, error) => __awaiter(void 0, void 0, void 0, function* () {
                    return routeImporter_1.Common.FailureError(error, request);
                }),
                validator: routeImporter_1.Joi,
            },
            response: {
                status: {
                    // 200: userResponse,
                    400: global_1.resp400,
                    500: global_1.resp500,
                },
            },
        },
    },
];
