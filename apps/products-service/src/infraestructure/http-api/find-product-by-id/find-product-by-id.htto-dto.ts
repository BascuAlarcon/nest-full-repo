import { IsNotEmpty, IsString } from "class-validator";

export class FindProductByIdHttpDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}