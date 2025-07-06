import { ApiProperty } from '@nestjs/swagger';

export class StandardResponseDto<T> {
  @ApiProperty({
    description: 'Indicates wheter the request was successful or not',
    example: false,
  })
  error: boolean;

  @ApiProperty({
    description: 'Data returned by the request',
  })
  @ApiProperty()
  data: T;
}
