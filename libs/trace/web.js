
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { B3Propagator } from "@opentelemetry/propagator-b3";
import {
  CompositePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
const {
  FetchInstrumentation,
} = require("@opentelemetry/instrumentation-fetch");

const _ctx = {
  provider: null,
};

if (!_ctx.provider) {
  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "app-sample",
    }),
    serviceName: "app-sample",
  });

  const traceExporter = new OTLPTraceExporter();
  //const traceExporter = new ConsoleSpanExporter();

  provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

  provider.register({
    propagator: new CompositePropagator({
      propagators: [new B3Propagator(), new W3CTraceContextPropagator()],
    }),
  });

  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new XMLHttpRequestInstrumentation({
        // ignoreUrls: [/localhost/],
        /*
        propagateTraceHeaderCorsUrls: [
          'http://localhost:8090',
        ],
        */
      }),
      new FetchInstrumentation({
        ignoreUrls: [/localhost:5173\/sockjs-node/],
        propagateTraceHeaderCorsUrls: [
          "https://cors-test.appspot.com/test",
          "https://httpbin.org/get",
        ],
        clearTimingResources: true,
      }),
    ],
  });

  _ctx.provider = provider;
}

module.exports = () => _ctx.provider.getTracer();
