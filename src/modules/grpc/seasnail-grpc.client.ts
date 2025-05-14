import path from 'node:path';

import { ChannelCredentials } from '@grpc/grpc-js';
import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { ClientGrpc, ClientOptions } from '@nestjs/microservices';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import type { DomainServiceClient } from './gen/ts/domain';
import { DOMAIN_SERVICE_NAME } from './gen/ts/domain';
import type { IdentifierServiceClient } from './gen/ts/identifier';
import { IDENTIFIER_SERVICE_NAME, SEASNAIL_V1_PACKAGE_NAME } from './gen/ts/identifier';

@Injectable()
export class SeasnailGrpcClient implements OnModuleInit {
  static instance: SeasnailGrpcClient;

  private clientGrpc: ClientGrpc;

  public identifierServiceClient: IdentifierServiceClient;

  public domainServiceClient: DomainServiceClient;

  private isSecure = false;

  private url = '';

  constructor() {
    SeasnailGrpcClient.instance = this;
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
        package: SEASNAIL_V1_PACKAGE_NAME,
        protoPath: [path.join(__dirname, 'proto', 'identifier.proto'), path.join(__dirname, 'proto', 'domain.proto')],
        credentials: this.isSecure ? ChannelCredentials.createSsl() : ChannelCredentials.createInsecure(),
      },
    };

    this.clientGrpc = ClientProxyFactory.create(clientOptions) as unknown as ClientGrpc;
    this.identifierServiceClient = this.clientGrpc.getService<IdentifierServiceClient>(IDENTIFIER_SERVICE_NAME);
    this.domainServiceClient = this.clientGrpc.getService<DomainServiceClient>(DOMAIN_SERVICE_NAME);
  }

  onModuleInit(): void {
    this.identifierServiceClient = this.clientGrpc.getService<IdentifierServiceClient>(IDENTIFIER_SERVICE_NAME);
    this.domainServiceClient = this.clientGrpc.getService<DomainServiceClient>(DOMAIN_SERVICE_NAME);
  }
}
