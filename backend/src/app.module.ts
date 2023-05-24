import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comment/comment.module';
import TypeOrmConfigService from './config/typeorm.config';
import { ProfileModule } from './profile/profile.module';
import { UtilModule } from './util/util.module';
import { DreamDiaryModule } from './dreamdiary/dreamdiary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UserModule,
    ProfileModule,
    CommentModule,
    UtilModule,
    DreamDiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
