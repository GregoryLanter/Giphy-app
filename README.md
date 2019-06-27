# Giphy-app
App to pull back from Giphy API

##About Me
Project lets you search and save GIFS

##About Giphy-app
To star the project a user should can click on of the premade buttons at the top, or they can add a topic of thier own on the right. Once GIFS are displayed a user can click the heart icon to make it a favorite. Favorites are stored in local storage and will display when the page is loaded. Favorites can be displayed in full size by clicking the "Display Favorite" button. Favorite can be removed by clicking the heart icon a second time. You can clear the GIF display by clicking the clear button. When the Add GIFS checkbox is checked instead of replacing the current display the new images will be added to the end of the array.  This project was written and is maintained by me, Greg Lanter.

##Technical Notes
In this app we make a call to the Giphy API. We limit the results to 10 PG or nicer GIFS/ We dynaimcaly create a "card" and append them to the screen. I create a card object that has the information we need like still-url, animated-url, id, etc. To keep the favorites I store and array of these object in local storage after using stringify on it. 

https://gregorylanter.github.io/Giphy-app/
