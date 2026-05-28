import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { FirebaseModule } from '@core/firebase/firebase.module'
import { AuthGuard } from '@common/guards/auth.guard'
import { RolesGuard } from '@common/guards/roles.guard'
import { TransformInterceptor } from '@common/interceptors/transform.interceptor'
import { HttpExceptionFilter } from '@common/filters/http-exception.filter'
import { AuthModule } from '@features/auth/auth.module'
import { UsersModule } from '@features/users/users.module'
import { TrailsModule } from '@features/trails/trails.module'
import { ContentsModule } from '@features/contents/contents.module'
import { QuizzesModule } from '@features/quizzes/quizzes.module'
import { ProgressModule } from '@features/progress/progress.module'

@Module({
  imports: [
    FirebaseModule,
    AuthModule,
    UsersModule,
    TrailsModule,
    ContentsModule,
    QuizzesModule,
    ProgressModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
