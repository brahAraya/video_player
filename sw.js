const VERSION = "v1";

self.addEventListener("install", (event) => {
	event.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
	const request = event.request;

	if (request.method !== "GET") {
		return;
	}

	// revisa si el request fue hecho por Chrome o por la propia app
	// si el request fue hecho por la app la url debe contener 'http'
	if (!(event.request.url.indexOf("http") === 0)) return; // se salta el request si no fue hecho por protocolo http

	event.respondWith(cachedResponse(request));
	event.waitUntil(updateCache(request));
});

async function precache() {
	const cache = await caches.open(VERSION);
	return cache.addAll([
		"/",
		"/index.html",
		"/favicon.ico",
		"/assets/index.js",
		"/assets/MediaPlayer.js",
		"/assets/plugins/AutoPlay.js",
		"/assets/plugins/AutoPause.js",
		"/assets/index.css",
		"/assets/video.mp4",
	]);
}

async function cachedResponse(request) {
	const cache = await caches.open(VERSION);
	const response = await cache.match(request);

	return response || fetch(request);
}

async function updateCache(request) {
	const cache = await caches.open(VERSION);
	const response = await fetch(request);

	console.log(`Code: ${response.status} | Messsage: ${response.statusText}`);

	// si el response status es 206 (parcial) no actualiza el caché para evitar errores en el navegador
	if (response.status === 206) {
		console.log("Partial response, skipping cache update...");
	} else {
		cache.put(request, response.clone());
	}

	return cache;
}
