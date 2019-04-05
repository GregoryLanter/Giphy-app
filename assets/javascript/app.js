$(document).ready(function (){
    //set up my variables
    var topics = ["the simspson's", "bob's burgers", "futurama", "king of the hill", "bugs bunny", "doug", "angry beavers", "we bare bears", "rocko's modern life", "ducktales", "smurfs", "the amazing world of gumball", "spongebob"]
    var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var favs = [];
    var displayed = [];
    var nextInterval;
    var addGifs = false;
    var newGifs = false;

    //for each stored topic add a button
    topics.forEach(function (cartoon) {
        addButton(capitalizeButton(cartoon));
    })

    //function to capitalize the first letter of eac word
    function capitalizeButton(cartoon) {
        var returnStr = ""
        //capitalize the first letter
        returnStr = cartoon[0].toUpperCase();
        
        //look through the string if you find a sapce 
        //add the space and the next letter capirlized to the return string
        for (var i = 1; i < cartoon.length; i++) {
            returnStr = returnStr + cartoon[i];
            if (cartoon[i] == " ") {
                i++;
                returnStr = returnStr + cartoon[i].toUpperCase();
            }
        }
        return returnStr;
    }

    //Add a button to the screen for a topic
    function addButton(cartoon) {
        var newButton = $('<button>' + cartoon + '</button>');
        newButton.attr("type", "Button");
        newButton.addClass("giphyButton button");
        newButton.attr("id", cartoon);
        newButton.html(cartoon);
        newButton.appendTo($(".buttonHolder"));
    }

    //when the submit button is clicked 
    //grab the input from the text box
    //capitalize the first letter of each word 
    // add the button and update count and topic array
    $(".submit").on("click", function () {
        var newName = $("#cartoonName").val().toLowerCase();
        if (newName != "") {
            if (topics.indexOf(newName) == -1) {
                topics.push(newName);
                count.push(0);
                addButton(capitalizeButton(newName));
            } else {
                //if the entry is a duplicate do not allow it and tell the user 
                $("#message").text("There is already a button for " + newName);
                nextInterval = setInterval(duplicateButton, 5000);
            }
            $("#cartoonName").val("");
        }
    });

    //timer used to turn off duplicate topic message
    function duplicateButton() {
        clearInterval(nextInterval);
        $("#message").text("");
    }

    //build a card object to display the gif on the screen
    function buildCard(obj, fav, size) {
        //create the title div
        var divTitle = $("<div>");
        divTitle.text(obj.title.toUpperCase());

        //create the rating div
        var divRating = $("<div>");
        divRating.text("Rating: " + obj.rating.toUpperCase());


        // create the favorites div
        var divFavorite = $("<div><i class='far fa-heart'></i></div>");
        /*divFavorite.attr("data-favorite", fav);*/

        //create the image tag
        var elem = $("<img>");
        elem.attr("src", obj.still);
        elem.attr("data-still", obj.still);
        elem.attr("data-animate", obj.animated);
        elem.attr("data-state", "still");

        //create the card
        var divCardHolder = $("<div>");
        divCardHolder.attr("data-id", obj.id)

        //if it is in the large size 
        //check the favorite array so we can
        //correctly display the favorite button
        if (size == "large") {
            for(var i=0; i<favs.length; i++){
                //  check to see if the current id is a favorite or 
                //if the call to the function was passed the favorite key                
                if(favs[i].id == obj.id || fav == "true"){
                    //set the favorite button
                    divFavorite.addClass("favoriteTrue");
                    divFavorite.attr("color","antiquewhite")
                    divFavorite.attr("data-favorite", "true");
                    //exit the loop
                    i = favs.length+2;
                }
            };

            //if i made it through all of the elements it is not a favorite
            //style it accordingly
            if(i == favs.length){
                divFavorite.addClass("favoritesFalse");
                divFavorite.attr("color","darkgray")
                divFavorite.attr("data-favorite", "false");
            }
            //add classes to our new divs to style them
            divTitle.addClass("title");
            divRating.addClass("rating");
            divFavorite.addClass("favorite");
            //divFavorite.addClass("click");
            elem.addClass("gif");
            divCardHolder.addClass("cardHolder");
        } else {//ifit is a goint in the favorite div it need to be small
            //add classes to style it appropriately
            divTitle.addClass("smallTitle");
            divRating.addClass("smallRating");
            divFavorite.addClass("favorite");
            divFavorite.addClass("favoriteTrue");
            elem.addClass("smallGif");
            divCardHolder.addClass("smallCardHolder");
        }
        /*divCardHolder.addClass("cardHolder");*/
        //buid the card by apprending the divs together
        divTitle.appendTo(divCardHolder);
        elem.appendTo(divCardHolder);
        divRating.appendTo(divCardHolder);
        divFavorite.appendTo(divCardHolder);
        return divCardHolder;
    }

    //when the chekbox changes toggle the variable;
    $(".check").change(function () {
        //if ($(this).val() == "add") {
            addGifs = !addGifs;
        /*} else {
            newGifs = !newGifs;
        }*/

    });

    //when cler button is clicked call routine to remove all the cards
    $(".cancel").on("click", function () {
        clearGifs();
    });

    function clearGifs() {
        //remove all cards from the screen
        //and clear the displayed array
        $(".cardHolder").remove();
        displayed.splice(0,displayed.length);

    }

    //replace current cards with favorites
    $(".favButton").on("click", function () {
        clearGifs();
        favs.forEach(function (elem) {
            var card = buildCard(elem, "true", "large")
            card.appendTo(".gifHolder");
            displayed.push()
        });
    });

    $(document).ready(function () {
        //when the page loads get the favorites from local storage
        var obj = JSON.parse(localStorage.getItem("favorites"));
        if(obj != null){
            favs = obj;
            favs.forEach(function (elem) {
                console.log(elem);
                var card = buildCard(elem, "true", "small");
                card.appendTo(".favoriteHolder");
            });
        }
    });
    //when a topic button is clicked call the API and 
    //display the results
    $(document.body).on("click", ".giphyButton", function () {
        //get the offset so we get new GIFS
        var offset = 0;
        offset = count[topics.indexOf($(this).text().toLowerCase())];
        count[topics.indexOf($(this).text().toLowerCase())] = offset + 10;

        //clear gifs
        if (!addGifs) {
            clearGifs();
        }
        //get the object that was clicked
        var name = $(this).text();

        //build api call url
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + name + "&limit=10&rating=pg&offset=" + offset + "&api_key=QbudWOH5PKekkVata3883xPOW2vCWhML";
        
        //call API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //console.log(response);
            //loop trough results
            for (var i = 0; i < 10; i++) {
                //put the returned object in a variable
                var obj = response.data[i];

                //create a card object
                var cardObj = {
                    id: obj.id,
                    title: obj.title,
                    rating: obj.rating,
                    still: obj.images.original_still.url,
                    animated: obj.images.original.url,
                }
                //put the card object into our array
                displayed.push(cardObj);

                //build the card 
                var card = buildCard(cardObj, "false", "large")
                card.appendTo(".gifHolder");
            }
            //response.data.each(element){
            
            $(document.body).on("click", ".gif", function () {
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

            $(document.body).on("click", ".favorite", function () {
                //toggle the favorite data state 
                
                if ($(this).attr("data-favorite") == "true") {
                    //remove favorite style
                    $(this).removeClass("favoriteTrue");
                    $(this).addClass("favoriteFalse")
                    $(this).attr("data-favorite", "false");
                    
                    //find the card in our favs array and remove it
                    var searchID = $(this).parent().attr("data-id")
                    for (var i = 0; i < favs.length; i++) {
                        if (favs[i].id == searchID) {
                            /*var card = displayed[i];*/
                            favs.splice(i,1);
                            localStorage.setItem("favorites", JSON.stringify(favs));
                            i = displayed.length;
                        }
                    }

                    //remove the favorite thumbnail
                    var favHldobj = document.getElementsByClassName('favoriteHolder')
                    var nodes = favHldobj[0].childNodes;
                    nodes.forEach(function (elem) {
                        console.log(elem.dataset.id);
                        if (elem.dataset.id == searchID) {/*$(this).parent().attr("data-id")){*/
                            elem.remove();
                        }
                    });
                    // if we are setting a favorite copy the card to the favorites display              
                } else {
                    $(this).removeClass("favoriteFalse");
                    $(this).addClass("favoriteTrue")
                    $(this).attr("data-favorite", "true");

                    //loop through array of displayed cards until we find ours
                    for (var i = 0; i < displayed.length; i++) {
                        if (displayed[i].id == $(this).parent().attr("data-id")) {
                            var card = displayed[i];
                            favs.push(card);
                            localStorage.setItem("favorites", JSON.stringify(favs));
                            i = displayed.length;
                        }
                    }
                    //build a new card that matches the selected card
                    //move it to favorites
                    var card = buildCard(card, "true", "small");
                    card.appendTo(".favoriteHolder");
                }
            });
        });
    });
});