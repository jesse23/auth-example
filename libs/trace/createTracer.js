const opentelemetry = require("@opentelemetry/api");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { WebTracerProvider } = require("@opentelemetry/sdk-trace-web");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
  FetchInstrumentation,
} = require("@opentelemetry/instrumentation-fetch");

module.exports = (serviceName, isNode = true) => {
  const provider = isNode
    ? new NodeTracerProvider({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
      })
    : new WebTracerProvider({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
        serviceName: serviceName,
      });

  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));
  // provider.addSpanProcessor(new SimpleSpanProcessor(new ZipkinExporter()));

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();

  registerInstrumentations({
    // // when boostraping with lerna for testing purposes
    instrumentations: [
      isNode
        ? new HttpInstrumentation()
        : new FetchInstrumentation({
            ignoreUrls: [/localhost:5173\/sockjs-node/],
            propagateTraceHeaderCorsUrls: [
              "https://cors-test.appspot.com/test",
              "https://httpbin.org/get",
            ],
            clearTimingResources: true,
          }),
    ],
  });

  return opentelemetry.trace.getTracer("default");
};
