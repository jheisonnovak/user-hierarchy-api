import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class TracingInterceptor implements NestInterceptor {
	intercept(executionContext: ExecutionContext, next: CallHandler): Observable<void> {
		const tracer = trace.getTracer("user-hierarchy-api");
		const request = executionContext.switchToHttp().getRequest<Request>();
		const response = executionContext.switchToHttp().getResponse<Response>();

		const controllerName = executionContext.getClass().name;
		const methodName = executionContext.getHandler().name;
		const spanName = `${controllerName}.${methodName}`;

		return tracer.startActiveSpan(
			spanName,
			{
				kind: SpanKind.SERVER,
				attributes: {
					"http.method": request.method,
					"http.url": request.url,
					"http.route": request.route?.path,
					"controller.name": controllerName,
					"controller.method": methodName,
				},
			},
			span => {
				return next.handle().pipe(
					tap({
						next: data => {
							span.setAttributes({
								"http.status_code": response.statusCode,
								"response.data_length": JSON.stringify(data)?.length || 0,
							});
							span.setStatus({ code: SpanStatusCode.OK });
						},
						error: error => {
							span.setAttributes({
								"http.status_code": response.statusCode || 500,
								"error.name": error.name,
								"error.message": error.message,
							});
							span.setStatus({
								code: SpanStatusCode.ERROR,
								message: error.message,
							});
							span.recordException(error);
						},
						finalize: () => {
							span.end();
						},
					})
				);
			}
		);
	}
}
