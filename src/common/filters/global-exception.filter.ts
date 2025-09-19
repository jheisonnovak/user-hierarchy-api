import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Unexpected error";
		let error = "Internal Server Error";

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			message = exception.name;
			const responseBody: object | string = exception.getResponse();
			if (typeof responseBody === "object") {
				const errorResponse = responseBody as { message: string; error: string };
				error = errorResponse.error;
				message = errorResponse.message ?? message;
			} else {
				message = responseBody as string;
			}
		}

		response.status(status).json({
			message,
			error,
			statusCode: status,
		});
	}
}
