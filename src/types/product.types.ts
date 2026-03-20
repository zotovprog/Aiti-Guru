export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  }
  images: string[]
  thumbnail: string
  tags: string[]
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductsQueryParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  q?: string
}

export interface AddProductRequest {
  title: string
  price: number
  brand: string
  sku: string
}
