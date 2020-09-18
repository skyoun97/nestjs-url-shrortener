import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UrlLogs } from './urlLogs.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Column({ length: 100, unique: true })
  accessKey: string;

  @CreateDateColumn()
  createDate: string;

  @OneToMany(
    type => UrlLogs,
    urlLog => urlLog.url,
  )
  logs: UrlLogs[];
}
