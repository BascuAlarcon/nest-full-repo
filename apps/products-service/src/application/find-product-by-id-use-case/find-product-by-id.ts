import { ProductRepository } from "src/domain/product.repository"; 
import { PrimitiveProduct, Product } from "src/domain/product";  
import { Injectable } from "src/shared/dependency-injection/injectable";
import { FindProductByIdDto } from "./find-product-by-id.dto";
import { ProductNotFoundException } from "src/domain/product-not-found.exception";
 
@Injectable()
export class FindProductByIdUseCase{ 
    constructor(private readonly productRepository: ProductRepository){}

    async execute(FindProductByIdDto: FindProductByIdDto): Promise<{product: PrimitiveProduct}>{ 
        const product = await this.productRepository.findProductById(FindProductByIdDto.id);

        if (!product) {
            throw new ProductNotFoundException(FindProductByIdDto.id);
        }

        return { 
            product: product.toValue()
        }
    }
}