export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const gasResponse = await fetch(
      "https://script.google.com/macros/s/AKfycbzN4tOEfxKjSc2eA4muIbYpWsquAyJTXCnnEYol_dJdCLBxkSjJptdrGSLS5pETr16RIg/exec",
       {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(req.body)
      }
    );

    const text = await gasResponse.text();

    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}