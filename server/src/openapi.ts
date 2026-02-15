import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as yaml from 'js-yaml';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

async function generateOpenApi(): Promise<void> {
    const app = await NestFactory.create(AppModule, { logger: false });

    // Match runtime API prefix
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('Blog Posts Demo API')
        .setDescription('REST API for posts, employees, config, and running state')
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    const yamlDocument = yaml.dump(document, { noRefs: true });

    const outputPath = join(process.cwd(), 'openapi.yaml');
    writeFileSync(outputPath, yamlDocument, 'utf8');

    await app.close();
    // eslint-disable-next-line no-console
    console.log(`OpenAPI spec written to ${outputPath}`);
}

generateOpenApi().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to generate OpenAPI spec', error);
    process.exit(1);
});
