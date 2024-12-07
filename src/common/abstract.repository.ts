import { Injectable } from '@nestjs/common';
import type { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export abstract class AbstractRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: MongoRepository<T>) {}

  /**
   * Find all entities with optional filtering.
   * @param options - Query options
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find({ ...options });
  }

  /**
   * Find one entity based on criteria.
   * @param options - Query options
   */
  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne({ ...options });
  }

  /**
   * Find an entity by its ID.
   * @param id - ID of the entity
   */
  async findById(id: string | number): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>, // Cast the where clause to match the entity type
    });
  }

  /**
   * Save a single entity or multiple entities.
   * @param data - Entity or entities to save
   */
  async save(data: DeepPartial<T>): Promise<T> {
    return this.repository.save(data);
  }

  /**
   * Delete an entity by ID.
   * @param id - ID of the entity to delete
   */
  async deleteById(id: string | number): Promise<void> {
    await this.repository.delete(id);
  }

  /**
   * Count entities matching given criteria.
   * @param options - Query options
   */
  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count({ ...options });
  }

  /**
   * Soft delete an entity by ID (if entity supports soft deletes).
   * @param id - ID of the entity
   */
  async softDeleteById(id: string | number): Promise<void> {
    await this.repository.softDelete(id);
  }

  /**
   * Restore a soft-deleted entity by ID.
   * @param id - ID of the entity
   */
  async restoreById(id: string | number): Promise<void> {
    await this.repository.restore(id);
  }

  create(entityLike: DeepPartial<T>) {
    return this.repository.create(entityLike);
  }
}
