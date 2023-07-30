import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

interface Item {
  id: number;
  name: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetch("/api/items")
        .then((res) => res.json())
        .then((data) => {
          setItems(data.items);
          setLoaded(true);
        });
    }
  }, [loaded]);

  return (
    <>
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        {loaded ? (
          <ul>
            {items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <>
            <a href="https://vitejs.dev" target="_blank"></a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </>
        )}
      </div>
    </>
  );
}

export default App;
