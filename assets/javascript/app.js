$(document).ready(function () {
    var topics = ["The Simspsons", "Bob's Burgers", "Futurama", "King of the Hill", "Bugs Bunny", "Doug", "Angry Beavers", "Rugrats", "Rockos Modern Life", "Ducktales"]
    topics.forEach(function (cartoon) {
        addButton(cartoon);
    })
    function addButton(cartoon) {
        var newButton = $('<button>' + cartoon + '</button>');
        newButton.attr("type", "Button");
        newButton.addClass("giphyButton")
        newButton.attr("id", cartoon);
        newButton.html(cartoon);
        newButton.appendTo($(".buttonHolder"));
    }
    $("#submit").on("click", function () {
        var newName = $("#cartoonName").val();
        addButton(newName);
    });

    $(document.body).on("click", ".giphyButton", function () {

        //clear gifs
        $(".cardHolder").remove();
        //$(".giphyButton").on("click", function(){
        var name = $(this).text();
        //var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +name + "&api=QbudWOH5PKekkVata3883xPOW2vCWhML";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + name + "&limit=10&rating=pg&api_key=QbudWOH5PKekkVata3883xPOW2vCWhML";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (var i = 0; i < 10; i++) {
                var obj = response.data[i];
                /*<img src="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
                data-still="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
                data-animate="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200.gif" 
                data-state="still" class="gif"></img>*/
                var divRating = $("<div>");
                divRating.text("rating:" + obj.rating);
                divRating.addClass("rating");

                var elem = $("<img>");
                elem.attr("src", obj.images.original_still.url);
                elem.attr("data-still", obj.images.original_still.url);
                elem.attr("data-animate", obj.images.original.url);
                elem.addClass("gif");

                var divCardHolder = $("<div>");
                divCardHolder.addClass("cardHolder");

                elem.appendTo(divCardHolder);
                divRating.appendTo(divCardHolder);
                divCardHolder.appendTo(".gifHolder");

            }
            //response.data.each(element){
            $(".gif").on("click", function () {
                // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
                var state = $(this).attr("data-state");
                // If the clicked image's state is still, update its src attribute to what its data-animate value is.
                // Then, set the image's data-state to animate
                // Else set src to the data-still value
                if (state === "still") {
                    $(this).attr("src", $(this).attr("data-animate"));
                    $(this).attr("data-state", "animate");
                } else {
                    $(this).attr("src", $(this).attr("data-still"));
                    $(this).attr("data-state", "still");
                }
            });

        });
    });

});