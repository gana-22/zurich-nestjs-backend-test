export interface CreateProductDto {
  product_description?: string;
  location: string;
  price: string;
  product_code: string;
}

export interface UpdateProductDto {
  product_description?: string;
  location?: string;
  price?: string;
}

export interface BaseResponse {
  id: number;
  location: string;
  price: string;
}

export interface ProductDBResponse extends BaseResponse {
  product_description: string | null;
  product_code: string;
}

export interface ProductApiResponse extends BaseResponse {
  productDescription: string | null;
  productCode: string;
}

export interface RequestBody {
  productDescription?: string | null;
  location?: string;
  price?: string;
  productCode?: string;
}

export interface QueryParams {
  productCode?: string;
  location?: string;
}
