import { DataSource, DataSourceOptions } from 'typeorm';
import { getTypeOrmOptions } from './typeOrmOptions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { autoLoadEntities, ...rest } = getTypeOrmOptions();

export default new DataSource(rest as DataSourceOptions);
