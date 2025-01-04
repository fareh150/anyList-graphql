import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            // forbidNonWhitelisted: true, // comentado permite mas args
        }),
    );

    const PORT = process.env.PORT ?? 3000; // se agrega el puerto de la variable de entorno para que lo asigne digital ocean

    await app.listen(PORT);

    console.log(`Server running on port ${PORT}`);
}
bootstrap();
