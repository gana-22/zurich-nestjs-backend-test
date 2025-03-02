import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { CreateProductDto, UpdateProductDto } from "./dto/product.dto";
import { ProductApiResponse } from "./interface/product.interface";
import { snakeToCamel } from "../utils/common.util";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // helper method to find a product by product_code
  private async findProductByCode(productCode: string): Promise<Product[]> {
    const product = await this.productRepository.find({
      where: { product_code: productCode },
    });
    if (product.length < 1) {
      throw new NotFoundException(`Product with code ${productCode} not found`);
    }
    return product;
  }

  // find products based on the productCode and location params
  async findByParams(
    productCode: string,
    location: string,
  ): Promise<ProductApiResponse[] | null> {
    try {
      const query = {
        ...(productCode && { product_code: productCode }),
        ...(location && { location }),
      };

      const product = await this.productRepository.find({
        where: query,
      });
      if (product.length < 1) {
        throw new NotFoundException(`Product is not found`);
      }
      return snakeToCamel(product);
    } catch (error) {
      this.logger.error("Error fetching product", (error as Error).stack);
      throw error;
    }
  }

  // insert a new record as product into the table
  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductApiResponse> {
    try {
      const product = this.productRepository.create(createProductDto);
      const createdProduct = await this.productRepository.save(product);
      return snakeToCamel(createdProduct);
    } catch (error) {
      this.logger.error("Error creating product", (error as Error).stack);
      throw error;
    }
  }

  // update the product record based on the productCode param
  async update(
    productCode: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductApiResponse | null> {
    try {
      const products = await this.findProductByCode(productCode);

      const updatedProducts = await Promise.all(
        products.map(async (product) => {
          Object.assign(product, updateProductDto);
          return this.productRepository.save(product);
        }),
      );
      return snakeToCamel(updatedProducts);
    } catch (error) {
      this.logger.error("Error updating product", (error as Error).stack);
      throw error;
    }
  }

  // remove the product record based on the productCode param
  async remove(productCode: string): Promise<object> {
    try {
      await this.findProductByCode(productCode);
      await this.productRepository.delete({ product_code: productCode });
      return { message: "Product removed successfully" };
    } catch (error) {
      this.logger.error("Error deleting product", (error as Error).stack);
      throw error;
    }
  }
}
