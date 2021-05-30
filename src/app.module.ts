import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from '../config.json';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule, MongooseModule.forRoot(config.DB_CONNECTION)],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
