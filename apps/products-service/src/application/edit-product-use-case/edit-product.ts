import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/product.repository';
import { EditProductDto } from './edit-product.dto';

@Injectable()
export class EditProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: EditProductDto) {
    const product = await this.productRepository.findProductById(dto.id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.id} not found`);
    }

    product.update({
      name: dto.name,
      price: dto.price,
      description: dto.description,
    });

    await this.productRepository.updateProduct(product);
    return product.toValue();
  }
}