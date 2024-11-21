import { Column } from 'typeorm';


export class RetentionEntity {
  @Column()
  time?: number;

  @Column()
  count?: number;

  @Column()
  kinds?: number[];
}
