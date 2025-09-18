import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { B3Propagator } from "@opentelemetry/propagator-b3";
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import * as process from "process";

const sdk = new NodeSDK({
	serviceName: "user-hierarchy-api",
	// metricReader: new PeriodicExportingMetricReader({
	// 	exporter: new ConsoleMetricExporter(),
	// }),
	spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter({ url: process.env.JAEGER_ENDPOINT })),
	contextManager: new AsyncLocalStorageContextManager(),
	textMapPropagator: new CompositePropagator({
		propagators: [new JaegerPropagator(), new W3CTraceContextPropagator(), new W3CBaggagePropagator(), new B3Propagator()],
	}),
	instrumentations: [getNodeAutoInstrumentations()],
});

export default sdk;

process.on("SIGTERM", () => {
	sdk.shutdown()
		.then(
			() => console.log("SDK shut down successfully"),
			err => console.log("Error shutting down SDK", err)
		)
		.finally(() => process.exit(0));
});
