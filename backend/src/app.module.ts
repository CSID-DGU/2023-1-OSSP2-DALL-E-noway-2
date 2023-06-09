import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfigService from './config/typeorm.config';
import { BoardModule } from './board/board.module';
import { ProfileModule } from './profile/profile.module';
import { UtilModule } from './util/util.module';
import { DreamDiaryModule } from './dreamdiary/dreamdiary.module';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { LikeBookmarkListModule } from './likebookmarklist/likebookmarklist.module';
import { CommentModule } from './comment/comment.module';
import { StatModule } from './dreamdiary/calendar/stat/stat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend/dist'),
      exclude: ['/api/(.*)', '/auth/(.*)'],
    }),
    AuthModule,
    UserModule,
    BoardModule,
    ProfileModule,
    CommentModule,
    UtilModule,
    DreamDiaryModule,
    CategoryModule,
    LikeBookmarkListModule,
    ProfileModule,
    StatModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
