$(document).ready(function () {
    var topics = ["The Simspsons", "Bob's Burgers", "Futurama", "King of the Hill", "Bugs Bunny", "Doug", "Angry Beavers", "We Bare Bears", "Rockos Modern Life", "Ducktales", "Smurfs", "The Amazing World of Gumball", "SpongeBob"]
    var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var nextInterval;
    var addGifs = false;
    var newGifs = false;

    topics.forEach(function (cartoon) {
        addButton(cartoon);
    })
    function addButton(cartoon) {
        var newButton = $('<button>' + cartoon + '</button>');
        newButton.attr("type", "Button");
        newButton.addClass("giphyButton button");
        newButton.attr("id", cartoon);
        newButton.html(cartoon);
        newButton.appendTo($(".buttonHolder"));
    }
    $("#submit").on("click", function () {
        var newName = $("#cartoonName").val();
        if (newName != "") {
            if (topics.indexOf(newName) == -1) {
                topics.push(newName);
                count.push(0);
                addButton(newName);
            } else {
                $("#message").text("There is already a button for " + newName);
                nextInterval = setInterval(duplicateButton, 5000);
            }
            $("#cartoonName").val("");
        }
    });

    function duplicateButton() {
        clearInterval(nextInterval);
        $("#message").text("");
    }

    $(".check").change(function () {
        if ($(this).val() == "add") {
            addGifs = !addGifs;
        } else {
            newGifs = !newGifs;
        }

    });

    $(document.body).on("click", ".giphyButton", function () {
        var offset = 0;
        if (newGifs) {
            offset = count[topics.indexOf($(this).text())];
            count[topics.indexOf($(this).text())] = offset + 10;
        } else {
            offset = 0;
        }

        //clear gifs
        if (!addGifs) {
            $(".cardHolder").remove();
        }
        //$(".giphyButton").on("click", function(){
        var name = $(this).text();
        //var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +name + "&api=QbudWOH5PKekkVata3883xPOW2vCWhML";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + name + "&limit=10&rating=pg&offset=" + offset + "&api_key=QbudWOH5PKekkVata3883xPOW2vCWhML";
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
                var divTitle = $("<div>");
                divTitle.text(obj.title);
                divTitle.addClass("title");

                var divRating = $("<div>");
                divRating.text("rating:" + obj.rating);
                divRating.addClass("rating");

                var divFavorite = $("<div><i class='far fa-heart'></i></div>");
                divFavorite.addClass("favorite");
                divFavorite.attr("data-favorite", false);

                var elem = $("<img>");
                elem.attr("src", obj.images.original_still.url);
                elem.attr("data-still", obj.images.original_still.url);
                elem.attr("data-animate", obj.images.original.url);
                elem.addClass("gif");

                var divCardHolder = $("<div>");
                divCardHolder.addClass("cardHolder");

                divTitle.appendTo(divCardHolder);
                elem.appendTo(divCardHolder);
                divRating.appendTo(divCardHolder);
                divFavorite.appendTo(divCardHolder);
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
            $(".favorite").on("click",function(){
                if($(this).attr("data-favorite") == "true"){
                    $(this).removeClass("favoriteTrue");
                    $(this).addClass("favoriteFalse")
                    $(this).attr("data-favorite", "false");
                }else{
                    $(this).removeClass("favoriteFalse");
                    $(this).addClass("favoriteTrue")
                    $(this).attr("data-favorite", "true");
                }
            });
        
        });
    });
});