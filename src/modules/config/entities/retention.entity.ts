import { Column } from 'typeorm';

export class RetentionEntity {
  @Column()
  time: number | null;

  @Column()
  count: number | null;

  @Column()
  kinds: number[][] | null;
}
