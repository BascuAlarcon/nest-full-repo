import { CreateProductUseCase } from "src/application/create-product-use-case/create-product";
import { CreateProductHttpDto } from "./create-product.http-dto";
import { Body, Controller, Post } from "@nestjs/common"; 
import { PrimitiveProduct } from "src/domain/product";

@Controller('products')
export class CreateProductController{
    constructor(private readonly createProductUseCase: CreateProductUseCase){}

    // la responsabilidad del controller es recibir la request, validar campos y llamar al caso de uso
    @Post()
    async run(@Body() createProductHttpDto: CreateProductHttpDto): Promise<{ product: PrimitiveProduct }>{
        // acá mapeamos del Dto del HTTP al Dto del caso de uso
        return await this.createProductUseCase.execute({
            id: createProductHttpDto.id,
            name: createProductHttpDto.name,
            description: createProductHttpDto.description,
            price: createProductHttpDto.price,
            stock: createProductHttpDto.stock,
        });
    }
}