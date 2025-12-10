// Inteface de como vamos a acceder a bases de datos
// Modela la tabla de la DB

import { Product } from "./product";

// al trabajar con clases extractas en NestJS nos facilita la inyección de dependencias, crear mocks automaticos
// esto tambien es conocido como "puerto" al cual se conecta un "adaptador" (capa infraestructura)
// no sabemos con que DB vamos a trabajar, solo sabemos que tenemos un repositorio que cumple con esta interfaz
export abstract class ProductRepository {
    abstract createProduct(product: Product): Promise<void>;
    abstract findProductById(id: string): Promise<Product | null>;
    abstract findAllProducts(): Promise<Product[]>;
    abstract updateProduct(product: Product): Promise<void>;
    abstract deleteProduct(id: string): Promise<void>; 
}