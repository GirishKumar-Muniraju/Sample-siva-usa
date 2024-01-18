import { Entity } from 'typeorm';
import { WRSBaseEntity } from './wrs-base.entity';

@Entity({ name: 'wrs_ucr', schema: 'ds_transactional' })
export class UCR extends WRSBaseEntity {}