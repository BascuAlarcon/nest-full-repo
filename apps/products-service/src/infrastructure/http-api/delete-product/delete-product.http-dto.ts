import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteProductHttpDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}