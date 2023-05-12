import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { OAuth } from 'src/entities/oauth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OAuth])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
