import { Injectable, NotFoundException } from "@nestjs/common";

import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    // private products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    async insertProduct(title: string, description: string, price: number) {
        // const prodId = Math.random().toString();
        // const newProduct = new Product(prodId, title, description, price);
        // this.products.push(newProduct);
        // return prodId;

        const newProduct = new this.productModel({
            title,
            description,
            price
        });
        const result = await newProduct.save();
        return result.id as string;
    }

    async getProducts() {
        // NOTE: the spread operator does not create a copy of the products
        // (those are still linked to in memory and technically editable)
        // SOLVED: used.map() to return copies of the product objects...

        // return [...this.products].map(prod => {
        //     return {...prod};
        // });

        const products = await this.productModel.find().exec();
        return products as Product[];
    }

    async getSingleProduct(productId: string) {
        const product = await this.findProduct(productId);
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price
        };
    }

    async updateProduct(productId: string, title: string, description: string, price: number) {
        // const [product, index] = this.findProduct(productId);
        // const updatedProduct = {...product};
        // if (title) {
        //     updatedProduct.title = title;
        // }
        // if (description) {
        //     updatedProduct.description = description;
        // }
        // if (price) {
        //     updatedProduct.price = price;
        // }
        // this.products[index] = {...updatedProduct };

        const updatedProduct = await this.findProduct(productId);
        if (title) {
            updatedProduct.title = title;
        }
        if (description) {
            updatedProduct.description = description;
        }
        if (price) {
            updatedProduct.price = price;
        }
        updatedProduct.save();
        
    }

    async deleteProduct(productId: string) {
        // const [product, index] = this.findProduct(productId);
        // const newProducts = [...this.products].filter(prod => prod.id !== productId);
        // this.products = [...newProducts];

        const result = await this.productModel.deleteOne({_id: productId}).exec();
        if (result.n === 0) {
            throw new NotFoundException('Could not find product...');
        }
    }

    // private findProduct(productId: string): [Product, number] {
    //     const productIndex = [...this.products].findIndex(prod => prod.id === productId);
    //     const product = this.products[productIndex];
    //     if (!product) {
    //         throw new NotFoundException('Could not find product...');
    //     }
    //     return [product, productIndex];
    // }

    private async findProduct(productId: string): Promise<Product> {
        let product;
        try {
            product = await this.productModel.findById(productId).exec();
        } catch (error) {
            throw new NotFoundException('Could not find product...');
        }
        if (!product) {
            throw new NotFoundException('Could not find product...');
        }
        return product;
    }
}
