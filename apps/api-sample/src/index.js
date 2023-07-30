const express = require("express");
const app = express();

// Simple jwt auth based on key 'secreate' and token in query string
app.get("/api/items", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
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
