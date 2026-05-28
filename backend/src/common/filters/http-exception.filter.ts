import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno do servidor'

    const message =
      typeof exceptionResponse === 'object' &&
      'message' in (exceptionResponse as object)
        ? (exceptionResponse as any).message
        : exceptionResponse

    const errors =
      typeof exceptionResponse === 'object' &&
      'errors' in (exceptionResponse as object)
        ? (exceptionResponse as any).errors
        : undefined

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception)
    }

    response.status(status).json({
      statusCode: status,
      message,
      errors,
      path: request.url,
      timestamp: new Date().toISOString(),
    })
  }
}
