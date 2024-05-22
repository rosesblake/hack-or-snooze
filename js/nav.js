"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

//show story submit on click

function navSubmitClick() {
    // If it doesn't have the class 'visible', hide other components and show $submitForm and $allStoriesList
    hidePageComponents();
    $submitForm.show();
    $allStoriesList.hide();
  }

//event listener added to the submit tag
$submitStory.on("click", navSubmitClick);

// favorites click functionality on nav bar
function navFavorites() {
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavorites);

//nav my stories

function navMyStories(){
  hidePageComponents();
  putMyStoriesOnPage();
  $myStories.show();
}

$body.on('click', '#my-stories-nav', navMyStories)

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  //hide the main nav bar while on login page
  $mainNav.hide();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
