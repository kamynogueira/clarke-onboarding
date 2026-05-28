import { Module } from '@nestjs/common'
import { QuizzesController } from './quizzes.controller'
import { QuizzesService } from './quizzes.service'
import { QuizModel } from '@models/quiz.model'
import { QuizAttemptModel } from '@models/quiz-attempt.model'
import { ProgressModel } from '@models/progress.model'
import { TrailModel } from '@models/trail.model'

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, QuizModel, QuizAttemptModel, ProgressModel, TrailModel],
  exports: [QuizzesService, QuizModel],
})
export class QuizzesModule {}
