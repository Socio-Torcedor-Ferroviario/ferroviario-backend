import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { StandardResponseDto } from 'src/common/stardard.response';

interface IApiStandardResponseOptions<TModel extends Type> {
  model?: TModel;
  isArray?: boolean; // <-- NOVA PROPRIEDADE
  status?: number;
  description?: string;
}

export function ApiStandardResponse<TModel extends Type>(
  options: IApiStandardResponseOptions<TModel> = {},
): MethodDecorator {
  const {
    model,
    isArray = false,
    status = 200,
    description = 'Operação realizada com sucesso',
  } = options;

  let dataSchema: Record<string, any>;

  if (model && isArray) {
    dataSchema = {
      type: 'array',
      items: { $ref: getSchemaPath(model) },
    };
  } else if (model) {
    dataSchema = { $ref: getSchemaPath(model) };
  } else {
    dataSchema = { type: 'object', nullable: true, example: null };
  }

  const responseDecorator = ApiResponse({
    status,
    description,
    schema: {
      allOf: [
        { $ref: getSchemaPath(StandardResponseDto) },
        {
          properties: {
            data: dataSchema,
          },
        },
      ],
    },
  });

  if (model) {
    return applyDecorators(
      ApiExtraModels(StandardResponseDto, model),
      responseDecorator,
    );
  } else {
    return applyDecorators(
      ApiExtraModels(StandardResponseDto),
      responseDecorator,
    );
  }
}
