"use strict";
const process = require("process");
const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
  MeterProvider,
} = require("@opentelemetry/sdk-metrics");
const {
  OTLPMetricExporter,
} = require("@opentelemetry/exporter-metrics-otlp-proto");
const { BoundCounter, CounterMetric } = require("@opentelemetry/metrics");

const _ctx = {
  provider: null,
  meter: null,
  counters: {},
};

if (!_ctx.provider) {
  const traceUrl = `${
    process.env.OT_AGENT_HOST || "http://localhost:4318"
  }/v1/traces`;
  const metricsUrl = `${
    process.env.OT_AGENT_HOST || "http://localhost:4318"
  }/v1/metrics`;
  const METRIC_INTERVAL = 5000;

  const exporterOptions = {
    url: traceUrl,
  };

  const meterProvider = new MeterProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "api-sample",
    }),
    // views: [expHistogramView],
  });

  meterProvider.addMetricReader(
    new PeriodicExportingMetricReader({
      // exporter: new ConsoleMetricExporter(),
      exporter: new OTLPMetricExporter({
        url: metricsUrl, // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
        headers: {}, // an optional object containing custom headers to be sent with each request
        concurrencyLimit: 1, // an optional limit on pending requests
      }),
      exportIntervalMillis: METRIC_INTERVAL,
    })
  );

  const meter = meterProvider.getMeter("api-sample");

  const cpuUsageMetric = meter.createCounter("cpu_process_time", {
    description: "Example of a Counter",
    unit: "ms",
  });

  function collectAndRecordMetrics() {
    const startUsage = process.cpuUsage();

    // Your heavy computation or processing here

    const endUsage = process.cpuUsage(startUsage);
    const userCPUTime = endUsage.user / 1000; // Convert to milliseconds

    cpuUsageMetric.add(userCPUTime);
  }

  setInterval(collectAndRecordMetrics, METRIC_INTERVAL);

  const traceExporter = new OTLPTraceExporter(exporterOptions);
  //const traceExporter = new ConsoleSpanExporter();
  const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "api-sample",
    }),
    serviceName: "api-sample",
  });

  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry

  sdk.start();

  // gracefully shut down the SDK on process exit
  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => console.log("Tracing terminated"))
      .catch((error) => console.log("Error terminating tracing", error))
      .finally(() => process.exit(0));
  });

  _ctx.provider = sdk._tracerProvider;
  _ctx.meter = meter;
}

module.exports = {
  getCounter: (name) => {
    if (!_ctx.counters[name]) {
      _ctx.counters[name] = _ctx.meter.createUpDownCounter(name)
    }
    return _ctx.counters[name];
  },
  getTracer: () => _ctx.provider.getTracer(),
}
