import { Test, TestingModule } from "@nestjs/testing";
import { ValidateQueryParams } from "./validation";
import { BadRequestException } from "@nestjs/common";

describe("ValidateQueryParams", () => {
  let validateQueryParams: ValidateQueryParams;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateQueryParams],
    }).compile();

    validateQueryParams = module.get<ValidateQueryParams>(ValidateQueryParams);
  });

  it("should be defined", () => {
    expect(validateQueryParams).toBeDefined();
  });

  it("should pass with valid query parameters", () => {
    const validParams = {
      productCode: "3000",
      location: "West Malaysia",
      price: "250.03",
    };
    expect(validateQueryParams.transform(validParams)).toEqual(validParams);
  });

  it("should throw BadRequestException for invalid query parameters", () => {
    const invalidParams = { locations: "East Malaysia" };

    try {
      validateQueryParams.transform(invalidParams);
    } catch (error) {
      const badRequestError = error as BadRequestException;
      expect(badRequestError).toBeInstanceOf(BadRequestException);

      const response = badRequestError.getResponse() as {
        message: string;
        error: string;
        statusCode: string;
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
