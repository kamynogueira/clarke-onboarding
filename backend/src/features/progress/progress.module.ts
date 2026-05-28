import { Module } from '@nestjs/common'
import { ProgressController } from './progress.controller'
import { ProgressService } from './progress.service'
import { ProgressModel } from '@models/progress.model'
import { TrailModel } from '@models/trail.model'
import { UserModel } from '@models/user.model'

@Module({
  controllers: [ProgressController],
  providers: [ProgressService, ProgressModel, TrailModel, UserModel],
  exports: [ProgressService],
})
export class ProgressModule {}
