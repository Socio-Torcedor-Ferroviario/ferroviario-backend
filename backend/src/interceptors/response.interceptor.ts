import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageDto } from 'src/common/dto/page.dto';
import { StandardResponseDto } from 'src/common/stardard.response';

export interface IStandardResponse {
  error: boolean;
  data: any;
  meta?: any;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IStandardResponse> {
    return next.handle().pipe(
      map((data: T) => {
        if (data instanceof PageDto) {
          return {
            error: false,
            data: data.data,
            meta: data.meta,
          };
        }
        return {
          error: false,
          data: data,
        };
      }),
    );
  }
}
