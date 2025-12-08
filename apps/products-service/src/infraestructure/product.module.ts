import { Module } from "@nestjs/common";
import { CreateProductController } from "./http-api/create-product/create-product.controller";
import { CreateProductUseCase } from "src/application/create-product-use-case/create-product";
import { InMemoryProductRepository } from "./repositories/in-memory-product-repository";
import { ProductRepository } from "src/domain/product.repository";
import { FindProductByIdController } from "./http-api/find-product-by-id/find-product-by-id.controller";
import { FindProductByIdUseCase } from "src/application/find-product-by-id-use-case/find-product-by-id";
import { PrismaProductRepository } from "./repositories/prisma-product-repository";

// Esto sólo puede ir en la capa de infraestructura, ya que esto sólo tiene que ver con el framework usado
@Module({ 
    controllers: [
        CreateProductController,
        FindProductByIdController
    ],
    providers: [
        CreateProductUseCase,
        FindProductByIdUseCase,
        { // vincula la interfaz con la implementacion concreta
            provide: ProductRepository, // interfaz
            useClass: PrismaProductRepository // clase concreta que implementa la interfaz
        }
    ],
    exports: [
        CreateProductUseCase,
        FindProductByIdUseCase
    ]
})
export class ProductModule{

}