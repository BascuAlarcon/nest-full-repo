import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../domain/product.repository';
import { DeleteProductDto } from './delete-product.dto';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(dto: DeleteProductDto) {
    const product = await this.productRepository.findProductById(dto.id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.id} not found`);
    }

    await this.productRepository.deleteProduct(dto.id);
    return { message: `Product with ID ${dto.id} has been deleted.` };
  }
}