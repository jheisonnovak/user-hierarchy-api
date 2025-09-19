import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { context, trace } from "@opentelemetry/api";
import { LoggerModule } from "nestjs-pino";

@Module({
	imports: [
		ConfigModule.forRoot(),
		LoggerModule.forRoot({
			pinoHttp: {
				autoLogging: false,
				serializers: {
					req(req) {
						return { id: req.id, method: req.method, url: req.url };
					},
				},
				level: process.env.LOG_LEVEL || "info",
				transport: process.env.NODE_ENV !== "production" ? { target: "pino-pretty", options: { colorize: true } } : undefined,
				customProps: () => {
					const span = trace.getSpan(context.active());
					if (!span) return {};
					const { traceId, spanId } = span.spanContext();
					return { trace: { id: traceId }, span: { id: spanId } };
				},
			},
		}),
	],
	exports: [LoggerModule],
})
export class LoggingModule {}
