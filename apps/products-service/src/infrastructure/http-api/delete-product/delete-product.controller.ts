import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteProductUseCase } from '../../../application/delete-product-use-case/delete-product';

@Controller('products')
export class DeleteProductController {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.deleteProductUseCase.execute({ id });
  }
}