import {
  Injectable,
  PipeTransform,
  BadRequestException,
  Logger,
} from "@nestjs/common";

@Injectable()
export class ValidateQueryParams implements PipeTransform {
  private readonly logger = new Logger(ValidateQueryParams.name);

  // validate query parameters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any) {
    const allowedParams = ["productCode", "location", "price"];
    const invalidParams = Object.keys(value).filter(
      (param) => !allowedParams.includes(param),
    );

    if (invalidParams.length > 0) {
      throw new BadRequestException(
        `Invalid query parameters: ${invalidParams.join(", ")}`,
      );
    }

    return value;
  }
}
