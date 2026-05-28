import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Clarke Onboarding API')
    .setDescription('API da plataforma de onboarding de colaboradores Clarke Energia')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT ?? 3000
  await app.listen(port)

  console.log(`🚀 Servidor rodando em http://localhost:${port}`)
  console.log(`📚 Swagger disponível em http://localhost:${port}/api/docs`)
}

bootstrap()
