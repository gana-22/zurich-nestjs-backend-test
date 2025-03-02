import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import {
  ProductResponse,
  DeleteResponse,
} from "./product/dto/product-response.dto";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle("Motor Insurance API")
    .setDescription("API for motor insurance pricing for Zurich")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ProductResponse, DeleteResponse],
  });
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
  Logger.log("Application is running on: " + (await app.getUrl()));
}
bootstrap();
