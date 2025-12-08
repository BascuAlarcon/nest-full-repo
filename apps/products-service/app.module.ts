import { Module } from "@nestjs/common";
import { ProductModule } from "src/infraestructure/product.module";


@Module({
    imports: [
        ProductModule
    ],
})
export class AppModule{}