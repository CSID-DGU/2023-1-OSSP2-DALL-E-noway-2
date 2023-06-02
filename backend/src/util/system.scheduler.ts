import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SystemScheduler {
  private readonly logger = new Logger(SystemScheduler.name);
  constructor(private readonly userService: UserService) {}

  /**
   * 매일 자정에 사용자의 이미지 요청 횟수를 초기화합니다.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetImageRequests(): Promise<void> {
    this.logger.debug(`Called ${this.resetImageRequests.name}`);
    await this.userService.resetAllUserImageRequests();
  }
}
