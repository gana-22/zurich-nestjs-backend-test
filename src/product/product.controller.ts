import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import {
  ProductResponse,
  DeleteResponse,
  CreateProductBody,
  UpdateProductBody,
} from "./dto/product-response.dto";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { camelToSnake } from "../utils/common.util";
import { ValidateQueryParams } from "../validators/validation";
import { RequestBody, QueryParams } from "./interface/product.interface";
import { ProductService } from "./product.service";

@Controller("product")
@ApiTags("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: "Get all products based on the provided parameters",
  })
  @ApiResponse({
    status: 200,
    description: "Get all products",
    schema: {
      type: "array",
      items: { $ref: getSchemaPath(ProductResponse) },
    },
  })
  @ApiQuery({ name: "productCode", required: false, type: String })
  @ApiQuery({ name: "location", required: false, type: String })
  @UsePipes(new ValidateQueryParams())
  async findByParams(@Query() query: QueryParams) {
    const { productCode, location } = query;
    return await this.productService.findByParams(
      productCode ?? "",
      location ?? "",
    );
  }

  @Post()
  @ApiOperation({ summary: "Create a new product" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateProductBody })
  @ApiResponse({
    status: 201,
    description: "The created product.",
    schema: {
      $ref: getSchemaPath(ProductResponse),
    },
  })
  @UseGuards(RolesGuard)
  @Roles("admin")
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() requestBody: RequestBody) {
    const transformedBody = camelToSnake(requestBody);
    const createProductDto = plainToClass(CreateProductDto, transformedBody);

    const errors = await validate(createProductDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.productService.create(createProductDto);
  }

  @Put()
  @ApiOperation({
    summary: "Update product(s) based on the provided productCode",
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProductBody })
  @ApiResponse({
    status: 200,
    description: "Update product(s)",
    schema: {
      type: "array",
      items: { $ref: getSchemaPath(ProductResponse) },
    },
  })
  @ApiQuery({ name: "productCode", required: false, type: String })
  @UseGuards(RolesGuard)
  @Roles("admin")
  @UsePipes(
    new ValidateQueryParams(),
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  )
  async update(@Query() query: QueryParams, @Body() requestBody: RequestBody) {
    const { productCode } = query;
    const transformedBody = camelToSnake(requestBody);
    const updateProductDto = plainToClass(UpdateProductDto, transformedBody);

    const errors = await validate(updateProductDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return await this.productService.update(
      productCode ?? "",
      updateProductDto,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Delete product(s) based on the provided productCode",
  })
  @ApiResponse({
    status: 200,
    description: "Product removed successfully.",
    schema: {
      $ref: getSchemaPath(DeleteResponse),
    },
  })
  @ApiQuery({ name: "productCode", required: false, type: String })
  @UseGuards(RolesGuard)
  @Roles("admin")
  @UsePipes(new ValidateQueryParams())
  async remove(@Query() query: QueryParams) {
    const { productCode } = query;
    return await this.productService.remove(productCode ?? "");
  }
}
