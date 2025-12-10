import { Module } from "@nestjs/common";
import { CreateProductController } from "./http-api/create-product/create-product.controller";
import { CreateProductUseCase } from "src/application/create-product-use-case/create-product";
import { ProductRepository } from "src/domain/product.repository";
import { FindProductByIdController } from "./http-api/find-product-by-id/find-product-by-id.controller";
import { FindProductByIdUseCase } from "src/application/find-product-by-id-use-case/find-product-by-id";
import { PrismaProductRepository } from "./repositories/prisma-product-repository";
import { ListProductsUseCase } from '../application/list-products-use-case/list-products';
import { ListProductsController } from './http-api/list-products/list-products.controller';
import { EditProductUseCase } from '../application/edit-product-use-case/edit-product';
import { EditProductController } from './http-api/edit-product/edit-product.controller';
import { DeleteProductUseCase } from '../application/delete-product-use-case/delete-product';
import { DeleteProductController } from './http-api/delete-product/delete-product.controller';

// Esto sólo puede ir en la capa de infraestructura, ya que esto sólo tiene que ver con el framework usado
@Module({
    controllers: [
        CreateProductController,
        ListProductsController,
        FindProductByIdController,
        EditProductController,
        DeleteProductController,
    ],
    providers: [
        CreateProductUseCase,
        FindProductByIdUseCase,
        ListProductsUseCase,
        EditProductUseCase,
        DeleteProductUseCase,
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