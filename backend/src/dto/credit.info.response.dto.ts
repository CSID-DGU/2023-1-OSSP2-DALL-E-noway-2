import { ApiProperty } from '@nestjs/swagger';
import { CreditInfoDto } from './credit.info.dto';

export class CreditInfoResponseDto {
  @ApiProperty({
    description: '사용자의 크레딧 정보',
  })
  creditInfo: CreditInfoDto;
}
