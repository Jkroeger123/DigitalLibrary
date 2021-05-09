const API_KEY = "f800afc56a41eeb52666b5b8657cea5e";

(function($){

    let requestConfig = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    };

    
    console.log($("#SiteData").html());



})(window.jQuery);