
// objeto de transferencia para comunicarse con la capa de aplicacion
 
export interface CreateProductDto{
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
}