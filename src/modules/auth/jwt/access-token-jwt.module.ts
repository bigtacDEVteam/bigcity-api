import { Injectable, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  jwtService: JwtService = new JwtService({
    secret: process.env.ACCESS_TOKEN_SECRET,
  });

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  sign(payload: any, expiresIn: number) {
    return this.jwtService.sign(payload, {
      expiresIn,
    });
  }

  async validate(payload: any) {
    return payload;
  }

  async verify(payload: any) {
    try {
      return this.jwtService.verify(payload);
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
}

@Module({
  providers: [AccessTokenJwtStrategy],
  exports: [AccessTokenJwtStrategy], // Export for reuse
})
export class AccessTokenJwtModule {}
