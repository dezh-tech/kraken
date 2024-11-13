import type { PipeTransform, Type } from '@nestjs/common';
import { Param, ParseUUIDPipe } from '@nestjs/common';
import type { ValidationOptions } from 'class-validator';
import { IsPhoneNumber as isPhoneNumber, registerDecorator } from 'class-validator';
import { isString } from 'lodash';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^[\d!#$%&*@A-Z^a-z]*$/.test(value);
        },
      },
    });
  };
}

export function IsPhoneNumber(
  validationOptions?: ValidationOptions & {
    region?: Parameters<typeof isPhoneNumber>[0];
  },
): PropertyDecorator {
  return isPhoneNumber(validationOptions?.region, {
    message: 'error.phoneNumber',
    ...validationOptions,
  });
}

export function IsTmpKey(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'tmpKey',
      target: object.constructor,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          return isString(value) && value.startsWith('tmp/');
        },
        defaultMessage(): string {
          return 'error.invalidTmpKey';
        },
      },
    });
  };
}

export function UUIDParam(property: string, ...pipes: Array<Type<PipeTransform> | PipeTransform>): ParameterDecorator {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
