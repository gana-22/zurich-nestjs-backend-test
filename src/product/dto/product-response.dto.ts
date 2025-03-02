import { ApiProperty, OmitType } from "@nestjs/swagger";

export class ProductResponse {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  productCode!: string;

  @ApiProperty()
  productDescription!: string;

  @ApiProperty()
  location!: string;

  @ApiProperty()
  price!: string;
}

export class DeleteResponse {
  @ApiProperty()
  message!: string;
}

export class CreateProductBody extends OmitType(ProductResponse, [
  "id",
] as const) {}

export class UpdateProductBody extends OmitType(ProductResponse, [
  "id",
  "productCode",
  "productDescription",
] as const) {}
