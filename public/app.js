// UV config
window.__uv$config = {
  prefix: "/uv/service/",
  bare: "/bare/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/uv/uv.sw.js", { scope: "/uv/service/" })
    .then(() => console.log("UUP SW registered"))
    .catch(e => console.error("SW failed:", e));
}

const engines = {
  ddg: "https://duckduckgo.com/?q=",
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
};

function doSearch() {
  const q = document.getElementById("search-input").value.trim();
  if (!q) return;
  const engine = document.getElementById("engine-select").value;
  let url = q.startsWith("http") ? q : engines[engine] + encodeURIComponent(q);
  doProxy(url);
}

function doProxy(url) {
  // Try UV first
  try {
    const encoded = __uv$config.encodeUrl(url);
    const frame = document.getElementById("proxy-frame");
    frame.src = __uv$config.prefix + encoded;
    frame.style.display = "block";
    document.getElementById("main-view").style.display = "none";
    document.getElementById("url-display").textContent = url;
  } catch(e) {
    // Fallback: about:blank trick
    aboutBlankOpen(url);
  }
}

function aboutBlankOpen(url) {
  const w = window.open("about:blank", "_blank");
  w.document.write(`
    <!DOCTYPE html><html><head>
    <style>*{margin:0;padding:0;}iframe{width:100vw;height:100vh;border:none;}</style>
    </head><body>
    <iframe src="${url}"></iframe>
    </body></html>
  `);
  w.document.close();
}

function focusSearch() {
  document.getElementById("search-input").focus();
}

function addTab() {
  const bar = document.querySelector(".tabbar");
  const newBtn = document.querySelector(".new-tab-btn");
  const tab = document.createElement("div");
  tab.className = "tab";
  tab.innerHTML = `
    <span class="tab-icon">📄</span>
    <span class="tab-title">New Tab</span>
    <span class="tab-close" onclick="this.parentElement.remove()">×</span>
  `;
  bar.insertBefore(tab, newBtn);
}
