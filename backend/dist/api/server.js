"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const express = require("express");
const { AppModule } = require('../dist/src/app.module');
const expressApp = express();
let initPromise = null;
function bootstrap() {
    if (!initPromise) {
        initPromise = (async () => {
            const app = await core_1.NestFactory.create(AppModule, new platform_express_1.ExpressAdapter(expressApp), { logger: ['error', 'warn'] });
            app.setGlobalPrefix('api/v1');
            app.enableCors({
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            });
            const swaggerConfig = new swagger_1.DocumentBuilder()
                .setTitle('Clarke Onboarding API')
                .setDescription('API da plataforma de onboarding Clarke Energia')
                .setVersion('1.0')
                .addBearerAuth()
                .build();
            const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
            swagger_1.SwaggerModule.setup('api/docs', app, document);
            await app.init();
        })();
    }
    return initPromise;
}
async function handler(req, res) {
    await bootstrap();
    expressApp(req, res);
}
//# sourceMappingURL=server.js.map