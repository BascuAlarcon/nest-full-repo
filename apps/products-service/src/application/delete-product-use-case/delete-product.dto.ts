import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteProductDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}