import "./App.css";

function App() {
  return (
    <>
      <h1>Home</h1>
      <div className="card">
        <ul>
          <li>
            <a href="/app-sample">app-sample</a>
          </li>
          <li>
            <a href="http://localhost:3301">Signoz</a>
          </li>
          <li>
            <a href="http://localhost:3300">Grafana</a>
          </li>
          <li>
            <a href="http://localhost:9411">Zipkin</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default App;
