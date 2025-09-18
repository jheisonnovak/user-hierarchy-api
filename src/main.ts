import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TracingInterceptor } from "./common/interceptors/tracing.interceptor";
import sdk from "./common/tracing";

async function bootstrap(): Promise<void> {
	sdk.start();
	const app = await NestFactory.create(AppModule);
	app.useGlobalInterceptors(new TracingInterceptor());
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
