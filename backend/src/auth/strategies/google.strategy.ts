// google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { VerifiedCallback } from 'passport-jwt';
@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_REDIRECT_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ): Promise<any> {
    // Extract user information from Google profile
    const { sub, email, given_name, family_name, picture } = profile._json;
    const user = {
      googleId: sub,
      email: email,
      photo: picture,
      firstName: given_name,
      lastName: family_name,
      accessToken,
    };

    done(null, user); // Pass the user information to the next middleware.
  }
}
