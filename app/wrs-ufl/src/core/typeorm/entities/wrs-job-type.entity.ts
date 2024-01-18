import { Entity } from 'typeorm';
import { WRSBaseEntity } from './wrs-base.entity';

@Entity({ name: 'wrs_job_type', schema: 'ds_transactional' })
export class JobType  extends WRSBaseEntity {}