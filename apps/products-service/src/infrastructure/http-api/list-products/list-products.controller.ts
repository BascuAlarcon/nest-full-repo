import { Controller, Get, Query } from '@nestjs/common';
import { ListProductsUseCase } from '../../../application/list-products-use-case/list-products';
import { ListProductsHttpDto } from './list-products.http-dto';

@Controller('products')
export class ListProductsController {
  constructor(private readonly listProductsUseCase: ListProductsUseCase) {}

  @Get()
  async listProducts(@Query() query: ListProductsHttpDto) {
    return this.listProductsUseCase.execute(query);
  }
}