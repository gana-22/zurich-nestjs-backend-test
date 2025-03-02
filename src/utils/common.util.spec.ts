import { camelToSnake, snakeToCamel } from "./common.util";

describe("Common Util", () => {
  describe("camelToSnake Function", () => {
    it("should convert camelCase to snake_case", () => {
      const requestBody = { productCode: "1000", productDescription: "Sedan" };
      const dbParams = {
        product_code: "1000",
        product_description: "Sedan",
      };
      expect(camelToSnake(requestBody)).toEqual(dbParams);
    });

    it("should handle empty objects", () => {
      const requestBody = {};
      const dbParams = {};
      expect(camelToSnake(requestBody)).toEqual(dbParams);
    });
  });

  describe("snakeToCamel", () => {
    it("should convert snake_case to camelCase", () => {
      const dbParams = {
        product_code: "1000",
        product_description: "Sedan",
      };
      const responseBody = {
        productCode: "1000",
        productDescription: "Sedan",
      };
      expect(snakeToCamel(dbParams)).toEqual(responseBody);
    });

    it("should handle empty objects", () => {
      const dbParams = {};
      const responseBody = {};
      expect(snakeToCamel(dbParams)).toEqual(responseBody);
    });

    it("should handle arrays of objects", () => {
      const dbParams = [
        { product_code: "1000", product_description: "Sedan" },
        { product_code: "2000", product_description: "SUV" },
      ];
      const responseBody = [
        { productCode: "1000", productDescription: "Sedan" },
        { productCode: "2000", productDescription: "SUV" },
      ];
      expect(snakeToCamel(dbParams)).toEqual(responseBody);
    });
  });
});
