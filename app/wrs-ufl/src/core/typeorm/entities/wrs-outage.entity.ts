import { Entity } from 'typeorm';
import { WRSBaseEntity } from './wrs-base.entity';

@Entity({ name: 'wrs_outage', schema: 'ds_transactional' })
export class Outage  extends WRSBaseEntity {}