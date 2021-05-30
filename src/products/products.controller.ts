import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    
    @Post()
    async addProduct(
        // @Body() completeBody: { title: string, description: string, price: number },
        @Body('title') prodTitle: string,
        @Body('description') prodDesc: string,
        @Body('price') prodPrice: number
    ) {
        const generatedId = await this.productsService.insertProduct(prodTitle, prodDesc, prodPrice);
        return { id: generatedId };
    }

    @Get()
    async getAllProducts() {
        const products = await this.productsService.getProducts();
        return products.map(prod => ({
            id: prod.id,
            title: prod.title,
            description: prod.description,
            price: prod.price
        }));
    }

    @Get(':id')
    async getSingleProduct(@Param('id') prodId: string) {
        const product = await this.productsService.getSingleProduct(prodId);
        return product;
    }

    @Patch(':id')
    async updateProduct(
        @Param('id') prodId: string,
        @Body() reqBody: { title: string, description: string, price: number }
    ) {
        await this.productsService.updateProduct(prodId, reqBody.title, reqBody.description, reqBody.price);
        return null;
    }

    @Delete(':id')
    async deleteProduct(@Param('id') prodId: string) {
        await this.productsService.deleteProduct(prodId);
        return null;
    }
}
