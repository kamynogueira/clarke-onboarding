import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModel } from '@models/user.model'

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserModel],
  exports: [AuthService],
})
export class AuthModule {}
