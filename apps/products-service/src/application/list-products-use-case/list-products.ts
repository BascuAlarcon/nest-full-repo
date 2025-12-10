import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/product.repository';
import { ListProductsDto } from './list-products.dto';

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: ListProductsDto) {
    const products = await this.productRepository.findAllProducts();
    return products.map(p => p.toValue());
  }
}