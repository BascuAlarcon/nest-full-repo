import { Controller, Put, Body, Param } from '@nestjs/common';
import { EditProductUseCase } from '../../../application/edit-product-use-case/edit-product';
import { EditProductHttpDto } from './edit-product.http-dto';

@Controller('products')
export class EditProductController {
  constructor(private readonly editProductUseCase: EditProductUseCase) {}

  @Put(':id')
  async editProduct(@Param('id') id: string, @Body() body: EditProductHttpDto) {
    return this.editProductUseCase.execute({ ...body, id });
  }
}