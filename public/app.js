const button = document.querySelector("#short");

button.addEventListener("click", shortenUrl);

async function shortenUrl() {
  const longUrl = document.querySelector("#longUrl").value.trim();
  const short = document.querySelector("#shortUrl");

  if (!longUrl) {
    alert("Please enter a URL");
    return;
  }

  try {
    button.disabled = true;
    button.textContent = "Shortening...";

    const response = await fetch("/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "URL shortening failed");
    }

    short.textContent = data.shortUrl;
    short.href = data.shortUrl;
  } catch (error) {
    console.error(error);
    alert("URL shorten nahi hua. Vercel logs check karo.");
  } finally {
    button.disabled = false;
    button.textContent = "Short";
  }
}
