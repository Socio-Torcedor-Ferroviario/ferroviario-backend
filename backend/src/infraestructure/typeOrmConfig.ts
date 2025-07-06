import { registerAs } from '@nestjs/config';
import { getTypeOrmOptions } from './typeOrmOptions';

export default registerAs('typeorm', getTypeOrmOptions);
