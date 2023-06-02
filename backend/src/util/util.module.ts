import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from 'src/user/user.module';
import { SystemScheduler } from './system.scheduler';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule],
  providers: [OpenAIService, SystemScheduler],
  exports: [OpenAIService],
})
export class UtilModule {}
