import path from 'node:path';
import { ChannelCredentials } from '@grpc/grpc-js';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientOptions, ClientProxyFactory, Transport } from '@nestjs/microservices';

import type { HealthServiceClient } from './gen/ts/immortal-health-service';
import { HEALTH_SERVICE_NAME, IMMORTAL_PACKAGE_NAME } from './gen/ts/immortal-health-service';

@Injectable()
export class ImmortalGrpcClient implements OnModuleInit {
  static instance: ImmortalGrpcClient;

  private clientGrpc: ClientGrpc;
  public serviceClient: HealthServiceClient;

  private isSecure = false;
  private url = '';

  constructor() {
    ImmortalGrpcClient.instance = this;
    this.initializeClient();
  }

  setUrl(url: string, isSecure = false): void {
    if (this.url !== url) {
      this.url = url;
      this.isSecure = isSecure;

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

    this.clientGrpc = ClientProxyFactory.create(clientOptions) as unknown as ClientGrpc;
    this.serviceClient = this.clientGrpc.getService<HealthServiceClient>(HEALTH_SERVICE_NAME);
  }

  onModuleInit(): void {
    this.serviceClient = this.clientGrpc.getService<HealthServiceClient>(HEALTH_SERVICE_NAME);
  }
}
