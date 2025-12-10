// Con este DTO tendremos validaciones respecto al body del frontend con class-validator o class-transformer

import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateProductHttpDto {

    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;  

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    stock: number;
}