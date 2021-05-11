(function($){

    CheckWatchList();

    CheckRating();

    function CheckRating()
    {
        let requestConfig = {
            method: 'GET',
            url: `/private/rating`
        };

        $.ajax(requestConfig).then(function (response){
            for(id of response.data)
            {
                if($('#movie-id').html() == id)
                {
                    $('#rating-form').empty().hide();
                    return;
                }
            }

            //Add listener to button
            $("#send-review").click(function(event){

                event.preventDefault();

                if($("#rating").val() == "" || $("#review").val() == "") return;

                let requestConfig = {
                    method: 'POST',
                    url: `/private/rate/${$('#movie-id').html()}`,
                    data: {review: $("#review").val(),
                            rating: $("#rating").val()}
                };

                $.ajax(requestConfig).then(function (response){
                    $('#rating-form').empty().append("Thank You For Leaving Your Review");
                    $('#avg-rating').empty().append(`Average User Rating: ${response.averageRating}`);
                })

            });
        });
    }

    function CheckWatchList()
    {
        let requestConfig = {
            method: 'GET',
            url: `/private/watchlist`
        };

        $.ajax(requestConfig).then(function (response){
            for(id of response.data)
            {
                if($('#movie-id').html() == id)
                {
                    SetWatchListToRemove();
                    return;
                }
            }
            SetWatchListToAdd();
        });
    }


    function SetWatchListToRemove()
    {
        $(`#watchlist-btn`).empty();
        $(`#watchlist-btn`).append(`Remove From Watchlist`);
        $("#watchlist-btn").off("click");
        $(`#watchlist-btn`).click(() => {
            RemoveFromWatchList();
        })
    }

    function SetWatchListToAdd()
    {
        $(`#watchlist-btn`).empty();
        $(`#watchlist-btn`).append(`Add to Watchlist`);
        $("#watchlist-btn").off("click");
        $(`#watchlist-btn`).click(() => {
            AddToWatchList();
        })
    }


    function AddToWatchList()
    {
        let requestConfig = {
            method: 'POST',
            url: `/private/watchlist/${$('#movie-id').html()}`
        };

        $.ajax(requestConfig).then(function (response){
            console.log("add");
            SetWatchListToRemove();
        });

    }

    function RemoveFromWatchList()
    {
        let requestConfig = {
            method: 'POST',
            url: `/private/watchlist/remove/${$(`#movie-id`).html()}`
        };

        $.ajax(requestConfig).then(function (response){
            console.log("removed");
           SetWatchListToAdd();
        });

    }


})(window.jQuery);