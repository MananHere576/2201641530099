import { useState } from "react"

const api = "http://localhost:9001"

function App() {
  const [url, setUrl] = useState("")
  const [validity, setValidity] = useState(30)
  const [code, setCode] = useState("")
  const [result, setResult] = useState(null)
  const [fetchCode, setFetchCode] = useState("")
  const [fetchResult, setFetchResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult("Creating...")
    try {
      const res = await fetch(`${api}/shorturls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, validity, shortcode: code || undefined })
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
      } else {
        setResult({ error: data.error || "Error" })
      }
    } catch (err) {
      setResult({ error: "Network error" })
    }
  }

  const handleFetch = async () => {
    setFetchResult("Fetching...")
    try {
      const res = await fetch(`${api}/shorturls/${fetchCode}`)
      const data = await res.json()
      if (res.ok) {
        setFetchResult(data)
      } else {
        setFetchResult({ error: data.error || "Error" })
      }
    } catch (err) {
      setFetchResult({ error: "Network error" })
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", padding: 20, background: "#476309ff", color: "#fff", borderRadius: 12 }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, padding:20 }}>
        <input type="url" placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} required />
        <input type="number" placeholder="Validity in minutes" value={validity} onChange={e => setValidity(e.target.value)} />
        <input type="text" placeholder="Custom shortcode (optional)" value={code} onChange={e => setCode(e.target.value)} />
        <button type="submit">Shorten</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {result && result.error && <p style={{ color: "red" }}>{result.error}</p>}
        {result && result.shortLink && (
          <>
            <p>Short Link: <a href={result.shortLink} target="_blank">{result.shortLink}</a></p>
            <p>Expires: {result.expiry}</p>
          </>
        )}
      </div>

      <hr style={{ margin: "30px 0", borderColor: "#334155" }} />

      <h3>Fetch Short URL Info</h3>
      <input type="text" placeholder="Enter shortcode" value={fetchCode} onChange={e => setFetchCode(e.target.value)} />
      <button onClick={handleFetch}>Get Info</button>

      <div style={{ marginTop: 20 }}>
        {fetchResult && fetchResult.error && <p style={{ color: "red" }}>{fetchResult.error}</p>}
        {fetchResult && fetchResult.url && (
          <>
            <p>Original URL: {fetchResult.url}</p>
            <p>Expires: {fetchResult.expiry}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
