import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { User } from '../model/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = '';
          if (
            req.headers['x-original-uri'] &&
            (req.headers['x-original-uri'] as string).split('?jwt=').length ===
              2
          ) {
            token = (req.headers['x-original-uri'] as string).split('?jwt=')[1];
          }
          return token;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user: User | undefined = this.userService.retrieveUser(payload.sub);

    if (user) {
      return user;
    }

    throw new ForbiddenException('user was not found');
  }
}
