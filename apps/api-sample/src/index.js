//const api = require('@opentelemetry/api');
// const tracer = require('@auth-example/trace')('auth-example-api-sample');
const { SpanStatusCode } = require("@opentelemetry/api");
const { getCounter, getTracer } = require("@auth-example/trace/node");
const express = require("express");
const app = express();
const logger = require("./logger");

const countryCounter = getCounter("request_countries");
const tracer = getTracer();

const wait = async (ms) => {
  const span = tracer.startSpan("wait", {
    kind: 1, // server
    attributes: { key: "value" },
  });
  // Annotate our span to capture metadata about the operation
  span.addEvent("start wait");

  await new Promise((resolve) => setTimeout(resolve, ms));

  const isError = Math.random() > 0.5;
  span.setStatus(
    isError
      ? {
          code: SpanStatusCode.ERROR,
          message: "mock Error",
        }
      : {
          code: SpanStatusCode.OK,
          message: "mock OK",
        }
  );

  if (isError) {
    const mockError = new Error(
      "api-sample[wait]: mock error!"
    );
    logger.error(mockError.message, mockError);
  } else {
    logger.info("api-sample[wait]: OK");
  }

  span.end();
};

// Simple jwt auth based on key 'secreate' and token in query string
app.get("/api/items", async (req, res) => {
  // apm span construction start
  /*
  const currentSpan = api.trace.getActiveSpan();
  // display traceid in the terminal
  const traceId = currentSpan.spanContext().traceId;
  console.log(`traceId: ${traceId}`);
  const span = tracer.startSpan('/api/items', {
    kind: 1, // server
    attributes: { key: 'value' },
  });
  // Annotate our span to capture metadata about the operation
  span.addEvent('handling /api/items');
  // apm span construction end
  */

  const country = req.query.country;

  countryCounter.add(1, { country });

  await wait(1000);
  await wait(1000);

  res.json({
    items: [
      { id: 1, name: "apple" },
      { id: 2, name: "banana" },
      { id: 3, name: "cherry" },
    ],
    totalFound: 3,
  });
});

const port = process.env.APP_PORT || 3002;

app.listen(port, () =>
  console.log(`Example app api-sample listening on port ${port}!`)
);
