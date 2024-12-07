/* eslint-disable canonical/no-use-extend-native */
/* eslint-disable @typescript-eslint/naming-convention,sonarjs/cognitive-complexity */

import { compact, map } from 'lodash';
import type { ObjectLiteral } from 'typeorm';

import type { AbstractEntity } from './common/abstract.entity';
import type { AbstractDto } from './common/dto/abstract.dto';
import type { KeyOfType } from './types';

declare global {
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[];
    toGrpces<K>(this: T[]): K[];
  }
}

declare module 'http' {
  interface IncomingHttpHeaders {
    'x-org-id'?: string;
    'x-user-info'?: string;
    authorization?: string;
  }
}

declare module 'typeorm' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[]): this;
  }

  interface SelectQueryBuilder<Entity> {
    leftJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    leftJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoinAndSelect<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;

    innerJoin<AliasEntity extends AbstractEntity, A extends string>(
      this: SelectQueryBuilder<Entity>,
      property: `${A}.${Exclude<KeyOfType<AliasEntity, AbstractEntity>, symbol>}`,
      alias: string,
      condition?: string,
      parameters?: ObjectLiteral,
    ): this;
  }
}

Array.prototype.toDtos = function <Entity extends AbstractEntity<Dto>, Dto extends AbstractDto>(
  options?: unknown,
): Dto[] {
  return compact(map<Entity, Dto>(this as Entity[], (item) => item.toDto(options as never)));
};

Array.prototype.toGrpces = function <T extends { toGrpc: () => K }, K>(): K[] {
  return compact(map<T, K>(this as T[], (item) => item.toGrpc()));
};
