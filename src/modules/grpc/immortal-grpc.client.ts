import path from 'node:path';

import { ChannelCredentials } from '@grpc/grpc-js';
import type { OnModuleInit } from '@nestjs/common';
import type { ClientGrpc, ClientOptions } from '@nestjs/microservices';
import { Client, Transport } from '@nestjs/microservices';

import type { HealthServiceClient } from './gen/ts/immortal-health-service';
import { HEALTH_SERVICE_NAME, IMMORTAL_PACKAGE_NAME } from './gen/ts/immortal-health-service';

export class ImmortalGrpcClient implements OnModuleInit {
  static instance: ImmortalGrpcClient;

  private clientGrpc: ClientGrpc;

  public serviceClient: HealthServiceClient;

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
        protoPath: path.join(__dirname, 'proto', 'immortal-health-service.proto'),
        credentials: this.isSecure ? ChannelCredentials.createSsl() : ChannelCredentials.createInsecure(),
      },
    };

    Client(clientOptions)(this, 'clientGrpc');
  }

  onModuleInit() {
    this.serviceClient = this.clientGrpc.getService<HealthServiceClient>(HEALTH_SERVICE_NAME);
  }
}
