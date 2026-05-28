import { Module } from '@nestjs/common'
import { TrailsController } from './trails.controller'
import { TrailsService } from './trails.service'
import { TrailModel } from '@models/trail.model'
import { UserModel } from '@models/user.model'

@Module({
  controllers: [TrailsController],
  providers: [TrailsService, TrailModel, UserModel],
  exports: [TrailsService, TrailModel],
})
export class TrailsModule {}
