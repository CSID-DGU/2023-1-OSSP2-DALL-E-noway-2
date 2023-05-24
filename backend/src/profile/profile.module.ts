import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from 'src/entities/user.entity';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { Follow } from 'src/entities/follow.entity';
import { Board } from 'src/entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DreamDiary, Follow, Board]),
    AuthModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
