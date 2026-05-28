import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import express = require('express')

// Use the tsc-compiled output rather than the TypeScript source.
// ncc (used by @vercel/node) cannot reliably bundle the NestJS
// decorator chain, but it handles pre-compiled CommonJS just fine.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppModule } = require('../dist/app.module')

const expressApp = express()
let initPromise: Promise<void> | null = null

function bootstrap(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { logger: ['error', 'warn'] },
      )

      app.setGlobalPrefix('api/v1')

      app.enableCors({
        origin: process.env.FRONTEND_URL ?? '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      })

      const swaggerConfig = new DocumentBuilder()
        .setTitle('Clarke Onboarding API')
        .setDescription('API da plataforma de onboarding Clarke Energia')
        .setVersion('1.0')
        .addBearerAuth()
        .build()

      const document = SwaggerModule.createDocument(app, swaggerConfig)
      SwaggerModule.setup('api/docs', app, document)

      await app.init()
    })()
  }

  return initPromise
}

export default async function handler(req: any, res: any) {
  await bootstrap()
  expressApp(req, res)
}
