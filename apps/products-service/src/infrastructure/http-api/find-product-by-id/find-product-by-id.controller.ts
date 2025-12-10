import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { FindProductByIdUseCase } from "src/application/find-product-by-id-use-case/find-product-by-id"; 
import { FindProductByIdHttpDto } from "./find-product-by-id.htto-dto";
import { PrimitiveProduct } from "src/domain/product";
import { ProductNotFoundException } from "../../../../../../libs/exceptions/not-found.exception";

@Controller('products')
export class FindProductByIdController{
    constructor(private readonly findProductById: FindProductByIdUseCase){}

    @Get(':id')
    async run(@Param() params: FindProductByIdHttpDto): Promise<{ product: PrimitiveProduct }>{
        try {
            return await this.findProductById.execute({
                id: params.id
            });
        } catch (error) {
            if(error instanceof ProductNotFoundException){
                throw new NotFoundException(error.message);
            }
            throw error;
        }

    }

}