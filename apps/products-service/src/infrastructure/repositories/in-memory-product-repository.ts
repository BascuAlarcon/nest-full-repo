 import { PrimitiveProduct, Product } from "src/domain/product";
import { ProductRepository } from "src/domain/product.repository";
import { Injectable } from "../../../../../libs/shared/injectable";

@Injectable()
export class InMemoryProductRepository implements ProductRepository {
    private products: PrimitiveProduct[] = [];
    
    
    async createProduct(product: Product): Promise<void> {
        this.products.push(product.toValue());
    }

    async findProductById(id: string): Promise<Product|null> {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            return null;
        }
        return new Product(product);
    }

    async findAllProducts(): Promise<Product[]> {
        return this.products.map(p => new Product(p));
    }

    async updateProduct(product: Product): Promise<void> {
        const index = this.products.findIndex(p => p.id === product.toValue().id);
        if (index !== -1) {
            this.products[index] = product.toValue();
        }
    }

    async deleteProduct(id: string): Promise<void> {
        this.products = this.products.filter(p => p.id !== id);
    }
}