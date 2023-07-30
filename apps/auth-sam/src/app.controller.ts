import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
  Query,
} from '@nestjs/common';
import { resolve } from 'path';
import express from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { SamlAuthGuard } from './auth/saml-auth.guard';
import { UserService } from './user/user.service';
import { User } from './model/user';
import { SamlStrategy } from './auth/saml.strategy';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly samlStrategy: SamlStrategy,
  ) {}

  @Get('api/auth/sso/saml/login')
  @UseGuards(SamlAuthGuard)
  async samlLogin() {
    //this route is handled by passport-saml
    return;
  }

  @Post('api/auth/sso/saml/ac')
  @UseGuards(SamlAuthGuard)
  async samlAssertionConsumer(
    @Request() req: any,
    @Response() res: express.Response,
  ) {
    //this routes gets executed on successful assertion from IdP
    if (req.user) {
      const user = req.user as User;
      const jwt = this.authService.getTokenForUser(user);
      this.userService.storeUser(user);
      res.cookie('jwt', jwt, { httpOnly: true, secure: false });
      // res.redirect('/mp3recordings/SampleAudio_0.4mb.mp3');
      // Retrieve the returnUrl from the cookie.
      const returnUrl = req.cookies['returnUrl'] || '/';
      res.clearCookie('returnUrl');
      res.redirect(returnUrl);
    }
  }

  @Get('api/auth/sso/saml/auth')
  @UseGuards(JwtAuthGuard)
  async authCheck(@Response() res: express.Response) {
    res.status(200).send('Authenticated');
  }

  @Get('login')
  async login(
    @Query('return_url') returnUrl: string,
    @Response() response: express.Response,
  ) {
    // Set the returnUrl as a cookie with an expiration time.
    response.cookie('returnUrl', returnUrl || '/', { maxAge: 600000 }); // Expires in 10 minutes

    // Redirect the user to the login page or the returnUrl (if provided).
    return response.redirect('/api/auth/sso/saml/login');
  }

  /////////////////////////////////////////////////////////////
  // Test routes
  /////////////////////////////////////////////////////////////
  @UseGuards(JwtAuthGuard)
  @Get('api/profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('api/auth/sso/saml/metadata')
  async getSpMetadata(@Response() res: express.Response) {
    const ret = this.samlStrategy.generateServiceProviderMetadata(null, null);
    res.type('application/xml');
    res.send(ret);
  }

  @Get()
  async root(@Response() res: express.Response) {
    res.status(200).send('auth server => /');
  }

  @Get('home')
  async homepage(@Response() res: express.Response) {
    res.sendFile(resolve('web/index.html'));
  }

  @Get('api/health')
  getHealth(@Response() res: express.Response) {
    res.status(200).send('OK');
  }
}
