$(document).ready(function (){
    
    var _url = "https://my-json-server.typicode.com/wintaraputra242/pwaapi2/products"

    var dataResult = ''
    var catResult = ''
    var names = []

    function renderPage(data) {    
        $.each(data, function (key, item){

            _cat = item.name
            
            dataResult += `
                            <h3>${_cat}</h3>
                            <p>${item.email}</p>
                        `
            if($.inArray(_cat, names) == -1){
                names.push(_cat);
                catResult += `<option value='${item.id}'>${_cat}</option>`
            }
        })

        $('#products').html(dataResult);
        $('#cat_select').html("<option value='all'>semua</option>" + catResult)
    }

    var networkDataRecevied = false;

    var networkUpdate = fetch(_url).then(function(response){
        return response.json()
    }).then(function (data) {
        networkDataRecevied = true
        renderPage(data)
    })

    caches.match(_url).then(function(response){
        if(!response) throw Error('no data on cache')
        return response.json()
    }).then(function (data) { 
        if(!networkDataRecevied) {
            renderPage(data)
            console.log('render data from cache')
        }
    }).catch(function () {  
        return networkUpdate
    })

    // filter by name

    $("#cat_select").on('change', function (){
        dataProductAfterFilter($(this).val())
    })

    function dataProductAfterFilter(value) {

        var dataResult = ''
        var _newUrl = _url

        if(value != 'all') _newUrl = _url + "?id=" + value        

        $.get(_newUrl, function (data) {
        
            $.each(data, function (key, item){
    
                _cat = item.name
                
                dataResult += `
                                <h3>${_cat}</h3>
                                <p>${item.email}</p>
                            `
                if($.inArray(_cat, names) == -1){
                    names.push(_cat);
                    catResult += `<option value='${_cat}'>${_cat}</option>`
                }
            })
    
            $('#products').html(dataResult);
    
        })
    }

    //register service worker

    if ('serviceWorker' in navigator) {
        // Register a service worker hosted at the root of the
        // site using the default scope.
        navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
          console.log('Service worker registration succeessful with scope:', registration.scope);
        }, /*catch*/ function(error) {
          console.log('Service worker registration failed:', error);
        });
      } else {
        console.log('Service workers are not supported.');
      }
    
    
})