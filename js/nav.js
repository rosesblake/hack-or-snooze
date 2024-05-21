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
  //hide Page Components
  hidePageComponents();
  //show submit form and all stories
  $submitForm.show();
  $allStoriesList.show();
}
//event listener added to the submit tag
$submitStory.on("click", navSubmitClick);

// favorites click functionality

function navFavorites() {
  hidePageComponents();
  putFavoritesOnPage();
}

$navFavorites.on("click", navFavorites);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
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
