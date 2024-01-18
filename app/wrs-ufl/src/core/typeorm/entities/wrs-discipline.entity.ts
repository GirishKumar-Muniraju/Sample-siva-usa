import { Entity } from 'typeorm';
import { WRSBaseEntity } from './wrs-base.entity';

@Entity({ name: 'wrs_discipline', schema: 'ds_transactional' })
export class Discipline extends WRSBaseEntity {}
