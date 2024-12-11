// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               v3.12.4
// source: immortal.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "immortal";

export interface EmptyRequest {
}

export interface ConfigResponse {
  success: boolean;
  message: string;
}

export interface Retention {
  time: number;
  count: number;
  kinds: number[];
}

export interface Subscription {
  amount: number;
  unit: string;
  period: number;
}

export interface Admission {
  amount: number;
  unit: string;
}

export interface Publication {
  kinds: number[];
  amount: number;
  unit: string;
}

export interface Fees {
  subscription: Subscription[];
  publication: Publication[];
  admission: Admission[];
}

export interface Parameters {
  retention: Retention | undefined;
  fees: Fees | undefined;
  name: string;
  description: string;
  pubkey: string;
  contact: string;
  software: string;
  supportedNips: number[];
  version: string;
  relayCountries: string[];
  languageTags: string[];
  tags: string[];
  postingPolicy: string;
  paymentsUrl: string;
  icon: string;
  url: string;
}

export const IMMORTAL_PACKAGE_NAME = "immortal";

export interface ImmortalServiceClient {
  /** Retrieves a configuration by name. */

  getConfig(request: EmptyRequest, metadata?: Metadata): Observable<Parameters>;

  /** Updates or creates a configuration. */

  setConfig(request: Parameters, metadata?: Metadata): Observable<ConfigResponse>;

  addWhiteList(request: Parameters, metadata?: Metadata): Observable<ConfigResponse>;
}

export interface ImmortalServiceController {
  /** Retrieves a configuration by name. */

  getConfig(request: EmptyRequest, metadata?: Metadata): Promise<Parameters> | Observable<Parameters> | Parameters;

  /** Updates or creates a configuration. */

  setConfig(
    request: Parameters,
    metadata?: Metadata,
  ): Promise<ConfigResponse> | Observable<ConfigResponse> | ConfigResponse;

  addWhiteList(
    request: Parameters,
    metadata?: Metadata,
  ): Promise<ConfigResponse> | Observable<ConfigResponse> | ConfigResponse;
}

export function ImmortalServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getConfig", "setConfig", "addWhiteList"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ImmortalService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ImmortalService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const IMMORTAL_SERVICE_NAME = "ImmortalService";
