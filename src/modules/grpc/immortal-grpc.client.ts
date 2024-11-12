import path from 'node:path';

import { ChannelCredentials } from '@grpc/grpc-js';
import type { OnModuleInit } from '@nestjs/common';
import type { ClientGrpc, ClientOptions } from '@nestjs/microservices';
import { Client, Transport } from '@nestjs/microservices';

import type { ImmortalServiceClient } from './gen/ts/immortal';
import { IMMORTAL_PACKAGE_NAME, IMMORTAL_SERVICE_NAME } from './gen/ts/immortal';

export class ImmortalGrpcClient implements OnModuleInit {
  static instance: ImmortalGrpcClient;

  private clientGrpc: ClientGrpc;

  public serviceClient: ImmortalServiceClient;

  constructor(
    private readonly url: string,
    private readonly isSecure: boolean,
  ) {
    ImmortalGrpcClient.instance = this;

    if (this.url) {
      this.initializeClient();
    }
  }

  private initializeClient(): void {
    const clientOptions: ClientOptions = {
      transport: Transport.GRPC,
      options: {
        url: this.url,
        package: IMMORTAL_PACKAGE_NAME,
        protoPath: path.join(__dirname, 'gen', 'immortal.proto'),
        credentials: this.isSecure ? ChannelCredentials.createSsl() : ChannelCredentials.createInsecure(),
      },
    };

    Client(clientOptions)(this, 'clientGrpc');
  }

  onModuleInit() {
    this.serviceClient = this.clientGrpc.getService<ImmortalServiceClient>(IMMORTAL_SERVICE_NAME);
  }
}
