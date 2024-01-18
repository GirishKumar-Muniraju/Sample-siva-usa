import { DataSource } from 'typeorm';
import { getDSConfig } from './datasource-config';

const ds = new DataSource(getDSConfig());
ds.initialize();

export const dataSource = ds;
