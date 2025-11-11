import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VisitorsModule } from './modules/visitors/visitors.module';
import { OperatorsController } from './modules/operators/operators.controller';
import { OperatorsModule } from './modules/operators/operators.module';

@Module({
 imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/**.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    VisitorsModule,
    OperatorsModule,
  ],
  controllers: [AppController, OperatorsController],
  providers: [AppService],
})
export class AppModule {}
