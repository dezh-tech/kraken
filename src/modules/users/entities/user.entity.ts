import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../../src/common/abstract.entity';
import { UserDto } from '../dtos/user.dto';

@Entity('users')
export class UserEntity extends AbstractEntity<UserDto> {
  dtoClass = UserDto;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  constructor(item?: Partial<UserEntity>) {
    super();

    if (!item) {
      return;
    }

    this.assign(item);
  }

  assign(item: Partial<UserEntity>): void {
    super.assign(item);

    this.email = item.email ?? this.email;
    this.password = item.password ?? this.password;
  }
}
