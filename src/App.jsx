import { useEffect, useState } from "react";

const API_URL = "https://mm214.com/demo.php";

// Kelvin → Celsius and Fahrenheit helpers
const kToC = (k) => Math.round((k - 273.15) * 10) / 10;
const kToF = (k) => Math.round(((k - 273.15) * 9) / 5 + 32);

export default function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function go() {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) setErr(e.message || String(e));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    go();
    return () => {
      ignore = true; // avoid state updates after unmount
    };
  }, []);

  return (
    <main className="app">
      <h1 className="title">Current Weather</h1>

      {loading && <p className="muted">Loading…</p>}
      {err && (
        <p role="alert" className="error">
          Error: {err}
        </p>
      )}

      {data && (
        <section className="card">
          <h2 className="city">{data.name ?? "—"}</h2>

          <p className="desc">
            {data.weather?.[0]?.description ? data.weather[0].description : "—"}
          </p>

          {typeof data.main?.temp === "number" ? (
            <p className="temp">
              {kToF(data.main.temp)}°F{" "}
              <span className="muted">({kToC(data.main.temp)}°C)</span>
            </p>
          ) : (
            <p className="temp">N/A</p>
          )}
        </section>
      )}

      <button onClick={() => window.location.reload()} className="btn">
        Refresh
      </button>
    </main>
  );
}
