(function($){

    $('#searchBtn').click(function(event){

        event.preventDefault();

        $("#searchBtn").off("click");

        RequestSearch();
        
    });


    function RequestSearch()
    {
        let searchTerm = $("#search_term").val();
        
        searchTerm = searchTerm.trim();

        if(searchTerm != null && searchTerm != "")
        {

            let requestConfig = {
                method: 'GET',
                url: `/private/search/${searchTerm}`
            };

            $.ajax(requestConfig).then(function (response){

                FillResults(response);

                $('#searchBtn').click(function(event){

                    event.preventDefault();
            
                    $("#searchBtn").off("click");
            
                    RequestSearch();
                    
                });

            });


        }
    }

    function FillResults(movies)
    {


        $("#movie-list").empty();

        for(movie of movies)
        {
            let li = $(`<li></li>`)

            let div = $(`<div class = "movie-display"></div>`);

            let link = $(`<a href = "/private/movie/${movie.id}"><img src = https://image.tmdb.org/t/p/w500${movie.poster_path} alt=""></a>`)

            li.append(div);

            div.append(link);

            $("#movie-list").append(div);
        }

    }

})(window.jQuery);