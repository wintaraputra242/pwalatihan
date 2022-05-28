const CACHE_NAME = 'my-site-cache-v1'
const urlToCache = [
  '/',
  '/fallback.json',
  '/css/style.css',
  '/js/main.js',
  '/js/jquery.min.js',
  '/images/logo.png'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('in install serviceworker... cache opened!')
      return cache.addAll(urlToCache)
    })
  );
});

self.addEventListener('fetch', event => {
  // console.log('Fetch event for ', event.request.url);
  // console.log(event.request)

  var request = event.request;
  var url = new URL(request.url);

  //memisahkan url api dengan interval  

  if(url.origin === location.origin){
     event.respondWith(
      caches.match(event.request)
      .then(response => {
        return response || fetch(request)
  
      })
     )
  }else{
    event.respondWith(
      caches.open('products-cache').then(function (cache) {
        return fetch(request).then(function (liveResponse) {
          cache.put(request, liveResponse.clone())
          return liveResponse
        })
      }).catch(function () {
        return caches.match(request).then(function (response) { 
          if(response) return response
          return caches.match('/fallback.json')
        })
      })
    );
  }

});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName != CACHE_NAME
        }).map(function (cacheName) { 
          return caches.delete(cacheName)
        })
      )
    })
  )
});

