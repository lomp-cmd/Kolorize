import React, {useState} from "react";

export default function App(){
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }

  const handleUpload = async () => {
    if (!file && !preview) return alert("Bitte ein Bild auswählen!");
    setLoading(true);
    try{
      // send data URL to serverless function
      const payload = { imageData: preview };
      const res = await fetch("/api/colorize", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Server error");
      setResult(json.output || json);
    }catch(err){
      console.error(err);
      alert("Fehler: " + err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>🎨 Linienzeichnung Kolorierer</h1>
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && <img src={preview} alt="preview" className="preview" />}
      <button onClick={handleUpload} disabled={loading}>{loading ? "Koloriere..." : "Kolorieren"}</button>
      {result && <div className="result"><h2>Antwort</h2><pre>{JSON.stringify(result, null, 2)}</pre></div>}
    </div>
  );
}
