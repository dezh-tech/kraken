/* eslint-disable max-classes-per-file */
import { CreateDateColumn, ObjectId, ObjectIdColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import type { Constructor } from '../types';
import type { AbstractDto } from './dto/abstract.dto';

/**
 * Abstract Entity
 * @author Narek Hakobyan <narek.hakobyan.07@gmail.com>
 *
 * @description This class is an abstract class for all entities.
 * It's experimental and recommended using it only in microservice architecture,
 * otherwise just delete and use your own entity.
 */
export interface IAbstractEntity<DTO extends AbstractDto, O = never> {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;

  toDto(options?: O): DTO;
}

export abstract class AbstractEntity<DTO extends AbstractDto = AbstractDto, O = never>
  implements IAbstractEntity<DTO, O>
{
  @PrimaryGeneratedColumn()
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  abstract dtoClass?: Constructor<DTO, [AbstractEntity, O?]>;

  toDto<T>(options?: O, newDto?: Constructor<T, [AbstractEntity, O?]>): DTO | T {
    const dtoClass = this.dtoClass;

    if (!dtoClass) {
      throw new Error(`You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`);
    }

    if (newDto) {
      return new newDto(this, options);
    }

    return new dtoClass(this, options);
  }

  constructor(item?: Partial<AbstractEntity>) {
    if (!item) {
      return;
    }

    this.assign(item);
  }

  assign(item: Partial<AbstractEntity>) {
    const { _id: id, createdAt, updatedAt } = item;

    if (id) {
      this._id = id;
    }

    this.createdAt = createdAt ? new Date(createdAt) : this.createdAt;
    this.updatedAt = updatedAt ? new Date(updatedAt) : this.updatedAt;
  }
}
