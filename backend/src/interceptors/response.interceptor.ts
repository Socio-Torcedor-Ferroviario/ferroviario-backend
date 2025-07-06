import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StandardResponseDto } from 'src/common/stardard.response';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ):
    | Observable<StandardResponseDto<T>>
    | Promise<Observable<StandardResponseDto<T>>> {
    return next.handle().pipe(
      map((data: T) => ({
        error: false,
        data: data,
      })),
    );
  }
}
