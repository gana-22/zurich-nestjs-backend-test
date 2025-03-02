import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import * as classValidator from "class-validator";
import {
  UpdateProductDto,
  ProductApiResponse,
  RequestBody,
} from "./interface/product.interface";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

describe("ProductController", () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findByParams: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    const defaultRequestBody: RequestBody = {
      productCode: "3000",
      productDescription: "hatchback",
      location: "West Malaysia",
      price: "250.03",
    };
    const defaultProductResult: ProductApiResponse = {
      id: 1,
      productCode: "3000",
      productDescription: "hatchback",
      location: "West Malaysia",
      price: "250.03",
    };

    it("should create a product with full requestBody", async () => {
      jest.spyOn(service, "create").mockResolvedValue(defaultProductResult);

      expect(await controller.create(defaultRequestBody)).toBe(
        defaultProductResult,
      );
    });

    it("should create a product with missing productDescription", async () => {
      const requestBody: RequestBody = {
        ...defaultRequestBody,
        productDescription: undefined,
      };
      const result: ProductApiResponse = {
        ...defaultProductResult,
        productDescription: null,
      };
      jest.spyOn(service, "create").mockResolvedValue(result);

      expect(await controller.create(requestBody)).toBe(result);
    });

    it("should return a validation error for missing location", async () => {
      const requestBody: RequestBody = {
        productCode: "3000",
        price: "250.03",
      };

      try {
        await controller.create(requestBody);
      } catch (error) {
        const badRequestError = error as BadRequestException;
        expect(badRequestError).toBeInstanceOf(BadRequestException);

        const response = badRequestError.getResponse() as {
          message: { constraints: { isNotEmpty: string } }[];
        };
        expect(response).toHaveProperty("message");
        expect(response.message[0].constraints.isNotEmpty).toContain(
          "location should not be empty",
        );
      }
    });

    it("should return a validation error for extra decimal places in price", async () => {
      const requestBody: RequestBody = {
        productCode: "4000",
        location: "West Malaysia",
        price: "250.005",
      };

      try {
        await controller.create(requestBody);
      } catch (error) {
        const badRequestError = error as BadRequestException;
        expect(badRequestError).toBeInstanceOf(BadRequestException);

        const response = badRequestError.getResponse() as {
          message: { constraints: { isDecimal: string } }[];
        };
        expect(response).toHaveProperty("message");
        expect(response.message[0].constraints.isDecimal).toContain(
          "price is not a valid decimal number",
        );
      }
    });

    it("should return a validation error for non-string price", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestBody: any = {
        productCode: "4000",
        location: "West Malaysia",
        price: 250,
      };

      try {
        await controller.create(requestBody);
      } catch (error) {
        const badRequestError = error as BadRequestException;
        expect(badRequestError).toBeInstanceOf(BadRequestException);

        const response = badRequestError.getResponse() as {
          message: { constraints: { isDecimal: string } }[];
        };
        expect(response).toHaveProperty("message");
        expect(response.message[0].constraints.isDecimal).toContain(
          "price is not a valid decimal number",
        );
      }
    });
  });

  describe("findByParams", () => {
    const productExpectedResult = [
      {
        id: 13,
        productCode: "2000",
        productDescription: null,
        location: "West Malaysia",
        price: "600.03",
      },
      {
        id: 14,
        productCode: "3000",
        productDescription: "hatchback",
        location: "East Malaysia",
        price: "200.03",
      },
      {
        id: 15,
        productCode: "3000",
        productDescription: "hatchback",
        location: "West Malaysia",
        price: "250.03",
      },
    ];

    it("should return products by productCode and location", async () => {
      const result = [productExpectedResult[0]];
      jest.spyOn(service, "findByParams").mockResolvedValue(result);

      expect(
        await controller.findByParams({
          productCode: "2000",
          location: "West Malaysia",
        }),
      ).toBe(result);
    });

    it("should return products by productCode", async () => {
      const result = productExpectedResult.slice(1, 3);
      jest.spyOn(service, "findByParams").mockResolvedValue(result);

      expect(await controller.findByParams({ productCode: "3000" })).toBe(
        result,
      );
    });

    it("should return products by location", async () => {
      const result = [productExpectedResult[2]];
      jest.spyOn(service, "findByParams").mockResolvedValue(result);

      expect(await controller.findByParams({ location: "West Malaysia" })).toBe(
        result,
      );
    });

    it("should return all products", async () => {
      const result = productExpectedResult.slice(1, 3);
      jest.spyOn(service, "findByParams").mockResolvedValue(result);

      expect(await controller.findByParams({})).toBe(result);
    });

    it("should return 404 for non-existent productCode", async () => {
      jest.spyOn(service, "findByParams").mockImplementation(() => {
        throw new NotFoundException("Product is not found");
      });

      try {
        await controller.findByParams({ productCode: "2000" });
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

    it("should return 400 for invalid query parameter", async () => {
      try {
        await controller.findByParams({
          locations: "West Malaysia",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      } catch (error) {
        const badRequestError = error as BadRequestException;
        expect(badRequestError).toBeInstanceOf(BadRequestException);

        const response = badRequestError.getResponse() as {
          message: string;
          error: string;
          statusCode: number;
        };
        expect(response).toHaveProperty("message");
        expect(response).toEqual({
          message: "Invalid query parameters: locations",
          error: "Bad Request",
          statusCode: 400,
        });
      }
    });
  });

  describe("update", () => {
    it("should update a product with valid data", async () => {
      const updateProductDto: UpdateProductDto = {
        location: "East Malaysia",
        price: "50.00",
      };

      const result = {
        id: 1,
        productCode: "1000",
        productDescription: "Sedan",
        location: "East Malaysia",
        price: "50.00",
      };
      jest.spyOn(service, "update").mockResolvedValue(result);

      expect(
        await controller.update({ productCode: "1000" }, updateProductDto),
      ).toBe(result);
    });

    it("should return a validation error for extra decimal places in price", async () => {
      const requestBody: RequestBody = {
        productCode: "4000",
        location: "West Malaysia",
        price: "250.005",
      };

      const validationErrors = [
        {
          property: "price",
          constraints: {
            isDecimal: "price is not a valid decimal number.",
          },
        },
      ];

      jest
        .spyOn(classValidator, "validate")
        .mockResolvedValue(validationErrors);
      try {
        await controller.create(requestBody);
      } catch (error) {
        const badRequestError = error as BadRequestException;
        expect(badRequestError).toBeInstanceOf(BadRequestException);

        const response = badRequestError.getResponse() as {
          message: { constraints: { isDecimal: string } }[];
        };
        expect(response).toHaveProperty("message");
        expect(response.message[0].constraints.isDecimal).toContain(
          "price is not a valid decimal number",
        );
      }
    });

    it("should return a validation error for non-string price", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestBody: any = {
        productCode: "4000",
        location: "West Malaysia",
        price: 250,
      };

      try {
        await controller.create(requestBody);
      } catch (error) {
        const badRequestError = error as BadRequestException;
        expect(badRequestError).toBeInstanceOf(BadRequestException);

        const response = badRequestError.getResponse() as {
          message: { constraints: { isDecimal: string } }[];
        };
        expect(response).toHaveProperty("message");
        expect(response.message[0].constraints.isDecimal).toContain(
          "price is not a valid decimal number",
        );
      }
    });
  });

  describe("remove", () => {
    it("should remove a product with valid productCode", async () => {
      jest.spyOn(service, "remove").mockResolvedValue({
        message: "Product removed successfully",
      });

      expect(await controller.remove({ productCode: "2000" })).toEqual({
        message: "Product removed successfully",
      });
    });

    it("should return a validation error for invalid query parameter", async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await controller.remove({ productCodes: "2000" } as any);
      } catch (error) {
        const badRequestError = error as BadRequestException;
        expect(badRequestError).toBeInstanceOf(BadRequestException);

        const response = badRequestError.getResponse() as {
          message: string;
          error: string;
          statusCode: number;
        };
        expect(response).toHaveProperty("message");
        expect(response).toEqual({
          message: "Invalid query parameters: productCodes",
          error: "Bad Request",
          statusCode: 400,
        });
      }
    });
  });
});
