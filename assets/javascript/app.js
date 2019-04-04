$(document).ready(function () {
    var topics = ["The Simspsons", "Bob's Burgers", "Futurama", "King of the Hill", "Bugs Bunny", "Doug", "Angry Beavers", "We Bare Bears", "Rockos Modern Life", "Ducktales", "Smurfs", "The Amazing World of Gumball", "SpongeBob"]
    var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var favs = [];
    var displayed=[];
    var nextInterval;
    var addGifs = false;
    var newGifs = false;
    

    topics.forEach(function (cartoon) {
        addButton(capitalizeButton(cartoon));
    })
    function capitalizeButton(cartoon){
        var returnStr = ""
        returnStr = cartoon[0].toUpperCase();
        for(var i=1; i<cartoon.length; i++){
            returnStr = returnStr + cartoon[i];
            if (cartoon[i] == " "){
                i++;
                returnStr = returnStr + cartoon[i].toUpperCase();
            }
        }
        return returnStr;
    }

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
                addButton(capitalizeButton(newName));
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
    function buildCard(obj, fav, size){
        var divTitle = $("<div>");
        divTitle.text(obj.title.toUpperCase());
        

        var divRating = $("<div>");
        divRating.text("Rating:" + obj.rating.toUpperCase());
        

        var divFavorite = $("<div><i class='far fa-heart'></i></div>");
        
        divFavorite.attr("data-favorite", fav);
        var elem = $("<img>");
        elem.attr("src", obj.still);
        elem.attr("data-still", obj.still);
        elem.attr("data-animate", obj.animated);

        var divCardHolder = $("<div>");
        divCardHolder.attr("data-id", obj.id)
        
        if(size == "large"){
            divTitle.addClass("title");
            divRating.addClass("rating");
            divFavorite.addClass("favorite");
            elem.addClass("gif");
            divCardHolder.addClass("cardHolder");
        }else{
            divTitle.addClass("smallTitle");
            divRating.addClass("smallRating");
            divFavorite.addClass("favorite");
            divFavorite.addClass("favoriteTrue");
            elem.addClass("smallGif");
            divCardHolder.addClass("smallCardHolder");
        }
        /*divCardHolder.addClass("cardHolder");*/

        if(fav == "true"){
            divFavorite.addClass("favoriteTrue");
        }else{
            divFavorite.addClass("favoriteFalse");
        }
        divTitle.appendTo(divCardHolder);
        elem.appendTo(divCardHolder);
        divRating.appendTo(divCardHolder);
        divFavorite.appendTo(divCardHolder);
        return divCardHolder;
    }
    $(".check").change(function () {
        if ($(this).val() == "add") {
            addGifs = !addGifs;
        } else {
            newGifs = !newGifs;
        }

    });
    $(".cancel").click(function(){
        clearGifs();
    });

    function clearGifs(){
        $(".cardHolder").remove();
    }

    $(document.body).on("click", ".giphyButton", function () {
        var offset = 0;
        offset = count[topics.indexOf($(this).text())];
        count[topics.indexOf($(this).text())] = offset + 10;

        //clear gifs
        if (!addGifs) {
            clearGifs();
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
                var cardObj = {                
                    id: obj.id,
                    title: obj.title,
                    rating: obj.rating,
                    still: obj.images.original_still.url,
                    animated:obj.images.original.url,
                }
                displayed.push(cardObj);
                
                var card = buildCard(cardObj,"false", "large")
                card.appendTo(".gifHolder");
            }
            //response.data.each(element){
            $(".gif",".ssmallGif").on("click", function () {
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
                    var searchID = $(this).parent().attr("data-id")
                    for(var i=0; i< displayed.length; i++){
                        if(displayed[i].id == searchID){
                            var card = displayed[i];
                            favs.pop(card);
                            i = displayed.length;
                        }
                    }
                    var favHldobj = document.getElementsByClassName('favoriteHolder')
                    var nodes = favHldobj[0].childNodes;
                    nodes.forEach( 
                        function(elem) { 
                          console.log(elem.dataset.id);
                          if(elem.dataset.id == searchID){/*$(this).parent().attr("data-id")){*/
                            elem.remove();
                          } 
                        }
                      );

                }else{
                    $(this).removeClass("favoriteFalse");
                    $(this).addClass("favoriteTrue")
                    $(this).attr("data-favorite", "true");
                    
                    for(var i=0; i< displayed.length; i++){
                        if(displayed[i].id == $(this).parent().attr("data-id")){
                            var card = displayed[i];
                            favs.push(card);
                            i = displayed.length;
                        }
                    }
                    var card = buildCard(card, "true", "small");
                    card.appendTo(".favoriteHolder");
                }
            });
            $(".favButton").on("click", function(){
                $(".cardHolder").remove();
                favs.forEach(function(elem){
                    var card = buildCard(elem, "true", "large")
                    card.appendTo(".gifHolder");
                });
            });
        });
    });
});