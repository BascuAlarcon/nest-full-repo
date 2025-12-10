import { PrismaClient } from "@prisma/client";
import { Product } from "src/domain/product"; 
import { ProductRepository } from "src/domain/product.repository";
import { Injectable } from "../../../../../libs/shared/injectable";

const prisma = new PrismaClient();

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  async createProduct(product: Product): Promise<void> {
    const productData = product.toValue();
    await prisma.product.create({ 
      data: {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        createdAt: productData.created_at,
        updatedAt: productData.updated_at,
        deletedAt: productData.deleted_at,
      }
    });
  }
  
  async findProductById(id: string): Promise<Product|null> {
    const productData = await prisma.product.findUnique({ where: { id } });
    if (!productData) return null;
    
    return new Product({
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      created_at: productData.createdAt,
      updated_at: productData.updatedAt,
      deleted_at: productData.deletedAt,
    });
  }
  
  async findAllProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
    });
    
    return products.map(productData => new Product({
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      created_at: productData.createdAt,
      updated_at: productData.updatedAt,
      deleted_at: productData.deletedAt,
    }));
  }
  
  async updateProduct(product: Product): Promise<void> {
    const productData = product.toValue();
    await prisma.product.update({
      where: { id: productData.id },
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        updatedAt: productData.updated_at,
        deletedAt: productData.deleted_at,
      },
    });
  }
  
  async deleteProduct(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } 
}