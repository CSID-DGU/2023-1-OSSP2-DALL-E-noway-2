import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { OAuth } from 'src/entities/oauth.entity';
import { ImageRequests } from 'src/entities/image.requests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OAuth, ImageRequests])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
