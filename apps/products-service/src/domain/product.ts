import { v4 as uuidv4 } from 'uuid';

export interface PrimitiveProduct{
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export class Product {
    constructor(private props: PrimitiveProduct) {}

    static create(createProduct: {
        id: string;
        name: string;
        price: number;
        description: string;
        stock: number;
    }): Product {
        const now = new Date();
        return new Product({
            id: uuidv4(),
            price: createProduct.price,
            name: createProduct.name,
            description: createProduct.description,
            stock: createProduct.stock,
            created_at: now,
            updated_at: now,
            deleted_at: null,
        });
    }
}