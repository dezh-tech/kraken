import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Event, verifyEvent } from 'nostr-tools';
import { Request } from 'express';
import { Strategy } from 'passport-strategy';

@Injectable()
export class Nip98Strategy extends PassportStrategy(Strategy, 'nip98') {
  public Scheme = 'Nostr';

  constructor() {
    super();
  }

  authenticate(req: unknown) {
    const request = req as Request
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return this.fail(new UnauthorizedException('Missing Authorization header'), 401);
    }

    if (authHeader.slice(0, 5) !== this.Scheme) {
      return this.fail(new UnauthorizedException('Invalid auth scheme'), 401);
    }

    const token = authHeader.slice(6);

    const bToken = Buffer.from(token, 'base64').toString('utf-8');

    if (!bToken || bToken.length === 0 || bToken[0] != '{') {
      return this.fail(new UnauthorizedException('Invalid token'), 401);
    }

    const ev = JSON.parse(bToken) as Event;

    const isValidEvent = verifyEvent(ev);
    if (!isValidEvent) {
      return this.fail(new UnauthorizedException('Invalid event'), 401);
    }

    if (ev.kind != 27_235) {
      return this.fail(new UnauthorizedException('Invalid nostr event, wrong kind'), 401);
    }

    const now = Date.now();
    const diffTime = Math.abs(ev.created_at * 1000 - now);

    // if (diffTime < 1 * 60 * 1000) { // 1 min
    //   return this.fail(new UnauthorizedException('Invalid nostr event, timestamp out of range'), 401);
    // }

    const urlTag = ev.tags[0]?.[1];
    const methodTag = ev.tags[1]?.[1];
    const a = new URL(urlTag!).pathname;
    console.log(new URL(urlTag!).pathname == request.path);
    if (!urlTag || new URL(urlTag).pathname !== request.path) {
      return this.fail(new UnauthorizedException('Invalid nostr event, URL tag invalid'), 401);
    }

    if (!methodTag || methodTag.toLowerCase() !== request.method.toLowerCase()) {
      return { success: false, message: 'Invalid nostr event, method tag invalid' };
    }

    this.success({ pubkey: ev.pubkey });
  }
}
