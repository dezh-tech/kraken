import { Transform } from 'class-transformer';
import { castArray, isArray, isNil, map, trim } from 'lodash';

/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns PropertyDecorator
 * @constructor
 */
export function Trim(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string[] | string;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replaceAll(/\s\s+/g, ' '));
    }

    return trim(value).replaceAll(/\s\s+/g, ' ');
  });
}

export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params) => {
      switch (params.value) {
        case 'true': {
          return true;
        }

        case 'false': {
          return false;
        }

        default: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return params.value;
        }
      }
    },
    { toClassOnly: true },
  );
}

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns PropertyDecorator
 * @constructor
 */
export function ToInt(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string;

      return Number.parseInt(value, 10);
    },
    { toClassOnly: true },
  );
}

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray(): PropertyDecorator {
  return Transform(
    (params) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = params.value;

      if (isNil(value)) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return castArray(value);
    },
    { toClassOnly: true },
  );
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (params) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return value.toLowerCase();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.map((v) => v.toLowّerCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    (params) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return value.toUpperCase();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return value.map((v) => v.toUpperCase());
    },
    {
      toClassOnly: true,
    },
  );
}
