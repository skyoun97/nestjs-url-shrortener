import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Url } from './urls.entity';

@Entity()
@Unique('access', ['url', 'accessDateHour'])
export class UrlLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  @Column('timestamp')
  accessDateHour: string;

  @Column({ default: 0 })
  accessCount: number;

  @ManyToOne(
    type => Url,
    url => url.logs,
  )
  url: Url;
}
