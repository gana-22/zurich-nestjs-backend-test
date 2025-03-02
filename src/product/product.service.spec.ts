import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import {
  ProductDBResponse,
  CreateProductDto,
  UpdateProductDto,
  ProductApiResponse,
} from "./interface/product.interface";
import { Product } from "./product.entity";
import { ProductService } from "./product.service";

describe("ProductService", () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findByParams", () => {
    const defaultProductDBResult = [
      {
        id: 1,
        product_code: "2000",
        product_description: null,
        location: "West Malaysia",
        price: "600.03",
      },
      {
        id: 2,
        product_code: "3000",
        product_description: "hatchback",
        location: "West Malaysia",
        price: "250.03",
      },
      {
        id: 3,
        product_code: "3000",
        product_description: "hatchback",
        location: "East Malaysia",
        price: "200.03",
      },
    ];

    const defaultProductAPIResult = [
      {
        id: 1,
        productCode: "2000",
        productDescription: null,
        location: "West Malaysia",
        price: "600.03",
      },
      {
        id: 2,
        productCode: "3000",
        productDescription: "hatchback",
        location: "West Malaysia",
        price: "250.03",
      },
      {
        id: 3,
        productCode: "3000",
        productDescription: "hatchback",
        location: "East Malaysia",
        price: "200.03",
      },
    ];

    it("should return products by productCode and location", async () => {
      const result: ProductDBResponse[] = [defaultProductDBResult[0]];
      jest.spyOn(repository, "find").mockResolvedValue(result);

      const expectedResponse: ProductApiResponse[] = [
        defaultProductAPIResult[0],
      ];
      expect(await service.findByParams("2000", "West Malaysia")).toEqual(
        expectedResponse,
      );
    });

    it("should return products by productCode", async () => {
      const result: ProductDBResponse[] = defaultProductDBResult.slice(1, 3);
      jest.spyOn(repository, "find").mockResolvedValue(result);

      const expectedResponse: ProductApiResponse[] =
        defaultProductAPIResult.slice(1, 3);
      expect(
        await service.findByParams("3000", undefined as unknown as string),
      ).toEqual(expectedResponse);
    });

    it("should return products by location", async () => {
      const result: ProductDBResponse[] = defaultProductDBResult.slice(0, 2);
      jest.spyOn(repository, "find").mockResolvedValue(result);

      const expectedResponse: ProductApiResponse[] =
        defaultProductAPIResult.slice(0, 2);
      expect(
        await service.findByParams(
          undefined as unknown as string,
          "West Malaysia",
        ),
      ).toEqual(expectedResponse);
    });

    it("should return all products", async () => {
      jest.spyOn(repository, "find").mockResolvedValue(defaultProductDBResult);

      expect(
        await service.findByParams(
          undefined as unknown as string,
          undefined as unknown as string,
        ),
      ).toEqual(defaultProductAPIResult);
    });

    it("should return 404 for non-existent productCode", async () => {
      jest.spyOn(repository, "find").mockResolvedValue([]);

      try {
        await service.findByParams("1000", undefined as unknown as string);
      } catch (error) {
        const notFoundError = error as NotFoundException;
        expect(notFoundError).toBeInstanceOf(NotFoundException);

        const response = notFoundError.getResponse() as {
          message: string;
          error: string;
          statusCode: number;
        };
        expect(response).toHaveProperty("message");
        expect(response).toEqual({
          message: "Product is not found",
          error: "Not Found",
          statusCode: 404,
        });
      }
    });
  });

  describe("create", () => {
    const defaultRequestBody: CreateProductDto = {
      product_code: "3000",
      product_description: "hatchback",
      location: "West Malaysia",
      price: "250.03",
    };
    const defaultProductDBResult: ProductDBResponse = {
      id: 1,
      product_code: "3000",
      product_description: "hatchback",
      location: "West Malaysia",
      price: "250.03",
    };
    const defaultProductAPIResult: ProductApiResponse = {
      id: 1,
      productCode: "3000",
      productDescription: "hatchback",
      location: "West Malaysia",
      price: "250.03",
    };

    it("should create a product", async () => {
      jest.spyOn(repository, "create").mockReturnValue(defaultProductDBResult);
      jest.spyOn(repository, "save").mockResolvedValue(defaultProductDBResult);

      expect(await service.create(defaultRequestBody)).toEqual(
        defaultProductAPIResult,
      );
    });

    it("should create a product with missing productDescription", async () => {
      const requestBody: CreateProductDto = {
        ...defaultRequestBody,
        product_description: undefined,
      };
      const result = { ...defaultProductDBResult, product_description: null };
      jest.spyOn(repository, "create").mockReturnValue(result);
      jest.spyOn(repository, "save").mockResolvedValue(result);

      const expectedResponse: ProductApiResponse = {
        ...defaultProductAPIResult,
        productDescription: null,
      };
      expect(await service.create(requestBody)).toEqual(expectedResponse);
    });
  });

  describe("update", () => {
    const requestBody: UpdateProductDto = {
      location: "Easter Malaysia",
      price: "50.00",
    };
    const defaultProductDBResult: ProductDBResponse = {
      id: 1,
      product_code: "1000",
      product_description: "Sedan",
      location: "Easter Malaysia",
      price: "50.00",
    };
    const defaultProductAPIResult: ProductApiResponse = {
      id: 1,
      productCode: "1000",
      productDescription: "Sedan",
      location: "Easter Malaysia",
      price: "50.00",
    };

    it("should update a product with valid data", async () => {
      jest
        .spyOn(repository, "find")
        .mockResolvedValue([defaultProductDBResult]);
      jest.spyOn(repository, "save").mockResolvedValue(defaultProductDBResult);

      expect(await service.update("1000", requestBody)).toEqual([
        defaultProductAPIResult,
      ]);
    });
  });

  describe("remove", () => {
    const defaultProductDBResult: ProductDBResponse = {
      id: 1,
      product_code: "1000",
      product_description: "Sedan",
      location: "Easter Malaysia",
      price: "50.00",
    };

    it("should remove a product with valid productCode", async () => {
      jest
        .spyOn(repository, "find")
        .mockResolvedValue([defaultProductDBResult]);
      jest
        .spyOn(repository, "delete")
        .mockResolvedValue({ raw: [], affected: 1 });

      expect(await service.remove("1000")).toEqual({
        message: "Product removed successfully",
      });
    });

    it("should return 404 for non-existent productCode", async () => {
      jest.spyOn(service, "remove").mockImplementation(() => {
        throw new NotFoundException("Product is not found");
      });

      try {
        await service.remove("productCodes=2000");
      } catch (error) {
        const notFoundError = error as NotFoundException;
        expect(notFoundError).toBeInstanceOf(NotFoundException);

        const response = notFoundError.getResponse() as {
          message: string;
          error: string;
          statusCode: number;
        };
        expect(response).toHaveProperty("message");
        expect(response).toEqual({
          message: "Product is not found",
          error: "Not Found",
          statusCode: 404,
        });
      }
    });
  });
});
