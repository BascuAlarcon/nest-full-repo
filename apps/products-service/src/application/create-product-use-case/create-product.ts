import { ProductRepository } from "src/domain/product.repository";
 import { CreateProductDto } from "./create-product.dto";
import { PrimitiveProduct, Product } from "src/domain/product";  
import { Injectable } from "../../../../../libs/shared/injectable";

// custom inyectable, para no depender directamente de NestJS en la capa de aplicacion
@Injectable()
export class CreateProductUseCase{
    // en ningún momento de esta capa, sabremos que framework se está usando o a que DB se está conectando
    // esto se logra mediante la clase abstracta (interfaz) ProductRepository
    // y es en el product.module.ts donde se vincula la interfaz con la implementación concreta
    constructor(private readonly productRepository: ProductRepository){}
    async execute(createProductDto: CreateProductDto): Promise<{product: PrimitiveProduct}>{
        const product = Product.create(createProductDto);
        await this.productRepository.createProduct(product);
        return {
            // se devuelve a la capa superior (infraestructura) un objeto primitivo (sin métodos)
            product: product.toValue()
        }
    }
}