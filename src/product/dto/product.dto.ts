import { IsString, IsDecimal, IsNotEmpty, IsOptional } from "class-validator";

export class BaseProductDto {
  @IsString()
  @IsOptional()
  product_description?: string;
}

export class CreateProductDto extends BaseProductDto {
  @IsString()
  @IsNotEmpty()
  product_code!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsDecimal({ decimal_digits: "2" })
  @IsNotEmpty()
  price!: string;
}

export class UpdateProductDto extends BaseProductDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsDecimal({ decimal_digits: "2" })
  @IsOptional()
  price?: string;
}
