import { Entity } from 'typeorm';
import { WRSBaseEntity } from './wrs-base.entity';

@Entity({ name: 'wrs_priority', schema: 'ds_transactional' })
export class Priority extends WRSBaseEntity {}
