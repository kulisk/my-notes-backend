import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { envConstants } from '../config/env-constants';

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(envConstants.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(envConstants.JWT_EXPIRES_IN),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthService, PassportModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
