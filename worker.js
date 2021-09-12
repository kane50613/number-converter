const preCacheFile = 'pre-v1.0.0'
const autoCacheFile = 'letswrite-v1.0.0'

const assets = [
    '/?utm_source=PWA&utm_medium=home_screen&utm_campaign=pwa',
    '/img/favicon.ico',
    '/img/favicon.png',
    '/img/favicon_192.png',
    '/img/favicon_512.png',
    '/img/favicon_512_maskable.png',
    '/index.js',
    '/style.css',
    '/JetBrainsMono.ttf',
    '/JetBrainsMono-Regular.woff2'
]

const limitCacheSize = (name, size) => {
    caches.open(name).then((cache) => {
        cache.keys().then((key) => {
            for(let i = 0; i < key.length - size; i++)
                cache.delete(key[0])
        })
    })
}

// install event
self.addEventListener('install', (e) => {
    self.skipWaiting()

    e.waitUntil(
        caches.open(preCacheFile).then(cache => {
            cache.addAll(assets)
                .catch(console.error)
        })
    )

    // https://stackoverflow.com/questions/30177782/chrome-serviceworker-postmessage
    const channel4Broadcast = new BroadcastChannel('channel4')

    channel4Broadcast.postMessage({ type: 'install' })
})

// activate event
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key) {
                if(preCacheFile.indexOf(key) === -1 && autoCacheFile.indexOf(key) === -1) {
                    return caches.delete(key)
                }
            }))
        })
    )
})

// fetch event
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.open(autoCacheFile).then(function(cache) {
            return fetch(e.request)
                .then(function(response) {
                const url = e.request.url
                if(url.indexOf('ads') === -1 && url.indexOf('googlesyndication') === -1 && url.indexOf('fbevents') === -1) {
                    cache.put(url, response.clone())
                    limitCacheSize(autoCacheFile, 200)
                }

                return response

            })

        })
            .catch(() => {
                return caches.match(e.request)
            })
    )
})