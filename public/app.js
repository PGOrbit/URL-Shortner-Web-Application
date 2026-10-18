const button = document.querySelector("#short");
button.addEventListener("click", shortenUrl);

async function shortenUrl() {
  const longUrl = document.querySelector("#longUrl").value;
  const response = await fetch("http://localhost:1234/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      longUrl: longUrl,
    }),
  });
  const data = await response.json();
  const short = document.querySelector("#shortUrl");
  short.innerText = data.shortUrl;
  short.href = data.shortUrl;
}
