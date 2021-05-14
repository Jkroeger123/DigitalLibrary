(function($){


    if($("#spoilerTag").text() == "on")
    {
        $("#discussion-wrapper").hide();
        $("#spoiler-warning").show();
        $("#spoiler-warning").click(function(event){
            $("#spoiler-warning").hide();
            $("#discussion-wrapper").show();
        });
    }else
    {
        $("#spoiler-warning").hide();
    }

    $("#send-comment").click(function(event){
        event.preventDefault();

        let comment = $('#comment').val();

        if(comment == undefined || comment.trim() == "") return;

        let requestConfig = {
            method: 'POST',
            url: `/private/comment/${$('#discussion-id').html()}`,
            data: {comment: comment}
        };

        $.ajax(requestConfig).then(function(response){

            let newComment = $(`<li>
                                    <h3>${response.username}</h3>
                                    <p>${comment}</p>
                                </li>`);

            //append comment
            $("#comment-list").append(newComment);

        });

    });


})(window.jQuery);