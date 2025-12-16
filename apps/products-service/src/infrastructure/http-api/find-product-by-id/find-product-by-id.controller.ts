import { Controller, Get, Param } from "@nestjs/common";
import { FindProductByIdUseCase } from "src/application/find-product-by-id-use-case/find-product-by-id"; 
import { FindProductByIdHttpDto } from "./find-product-by-id.htto-dto";
import { PrimitiveProduct } from "src/domain/product";

@Controller('products')
export class FindProductByIdController{
    constructor(private readonly findProductById: FindProductByIdUseCase){}

    @Get(':id')
    async run(@Param() params: FindProductByIdHttpDto): Promise<{ product: PrimitiveProduct }>{
        return await this.findProductById.execute({
            id: params.id
        });
    }
}