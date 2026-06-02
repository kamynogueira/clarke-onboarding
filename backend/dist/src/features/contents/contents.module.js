"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentsModule = void 0;
const common_1 = require("@nestjs/common");
const contents_controller_1 = require("./contents.controller");
const contents_service_1 = require("./contents.service");
const content_model_1 = require("../../models/content.model");
let ContentsModule = class ContentsModule {
};
exports.ContentsModule = ContentsModule;
exports.ContentsModule = ContentsModule = __decorate([
    (0, common_1.Module)({
        controllers: [contents_controller_1.ContentsController],
        providers: [contents_service_1.ContentsService, content_model_1.ContentModel],
        exports: [contents_service_1.ContentsService, content_model_1.ContentModel],
    })
], ContentsModule);
//# sourceMappingURL=contents.module.js.map