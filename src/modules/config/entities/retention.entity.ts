import { Column } from 'typeorm';

export class RetentionEntity {
  @Column({ nullable: true })
  time?: number;

  @Column({ nullable: true })
  count?: number;

  @Column({ nullable: true })
  kinds?: number[];
}
