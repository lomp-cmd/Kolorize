// in App.jsx
const res = await fetch("/api/colorize.js", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ imageData })
});
