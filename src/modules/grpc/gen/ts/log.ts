// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               v3.12.4
// source: log.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "manager.v1";

export interface AddLogRequest {
  message: string;
  stack: string;
}

export interface AddLogResponse {
  success: boolean;
  message?: string | undefined;
}

export const MANAGER_V1_PACKAGE_NAME = "manager.v1";

export interface LogClient {
  addLog(request: AddLogRequest, metadata?: Metadata): Observable<AddLogResponse>;
}

export interface LogController {
  addLog(
    request: AddLogRequest,
    metadata?: Metadata,
  ): Promise<AddLogResponse> | Observable<AddLogResponse> | AddLogResponse;
}

export function LogControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addLog"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Log", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Log", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const LOG_SERVICE_NAME = "Log";
