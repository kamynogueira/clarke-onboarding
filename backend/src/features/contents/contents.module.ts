import { Module } from '@nestjs/common'
import { ContentsController } from './contents.controller'
import { ContentsService } from './contents.service'
import { ContentModel } from '@models/content.model'

@Module({
  controllers: [ContentsController],
  providers: [ContentsService, ContentModel],
  exports: [ContentsService, ContentModel],
})
export class ContentsModule {}
