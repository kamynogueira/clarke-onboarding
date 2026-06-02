"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const firebase_module_1 = require("./core/firebase/firebase.module");
const auth_guard_1 = require("./common/guards/auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const auth_module_1 = require("./features/auth/auth.module");
const users_module_1 = require("./features/users/users.module");
const trails_module_1 = require("./features/trails/trails.module");
const contents_module_1 = require("./features/contents/contents.module");
const quizzes_module_1 = require("./features/quizzes/quizzes.module");
const progress_module_1 = require("./features/progress/progress.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            trails_module_1.TrailsModule,
            contents_module_1.ContentsModule,
            quizzes_module_1.QuizzesModule,
            progress_module_1.ProgressModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: auth_guard_1.AuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_INTERCEPTOR, useClass: transform_interceptor_1.TransformInterceptor },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map