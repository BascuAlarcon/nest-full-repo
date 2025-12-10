import { Module } from "@nestjs/common"; 
import { ProductModule } from "src/infrastructure/product.module";
 
@Module({
    imports: [
        ProductModule
    ],
})
export class AppModule{}