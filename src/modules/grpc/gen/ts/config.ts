// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               v3.12.4
// source: config.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "manager.v1";

export interface Limitations {
  maxMessageLength: number;
  maxSubscriptions: number;
  maxFilters: number;
  maxSubidLength: number;
  minPowDifficulty: number;
  authRequired: boolean;
  paymentRequired: boolean;
  restrictedWrites: boolean;
  maxEventTags: number;
  maxContentLength: number;
  createdAtLowerLimit: number;
  createdAtUpperLimit: number;
  defaultQueryLimit: number;
  maxQueryLimit: number;
}

export interface GetParametersRequest {
}

export interface GetParametersResponse {
  limitations: Limitations | undefined;
  url: string;
}

export const MANAGER_V1_PACKAGE_NAME = "manager.v1";

export interface ParametersClient {
  getParameters(request: GetParametersRequest, metadata?: Metadata): Observable<GetParametersResponse>;
}

export interface ParametersController {
  getParameters(
    request: GetParametersRequest,
    metadata?: Metadata,
  ): Promise<GetParametersResponse> | Observable<GetParametersResponse> | GetParametersResponse;
}

export function ParametersControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getParameters"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Parameters", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Parameters", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PARAMETERS_SERVICE_NAME = "Parameters";
