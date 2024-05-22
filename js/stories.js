"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  // console.debug("generateStoryMarkup", story);
  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showDelete ? getDelete() : ""}
      ${showStar ? getStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <br>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//submit the new story form
async function storySubmit(e) {
  e.preventDefault();
  // grab info from form
  const title = $("#title").val();
  const url = $("#url").val();
  const author = $("#author").val();
  //grab username from currentUser Object
  const username = currentUser.username;
  //data object
  const storyData = { title, url, author, username };
  //add user story using this data
  const story = await storyList.addStory(currentUser, storyData);
  //create the html for the story and add it to the page
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  // hide the form and reset it
  $submitForm.hide();
  $submitForm.trigger("reset");
  //https://www.geeksforgeeks.org/how-to-reset-a-form-using-jquery-with-reset-method/#
}

$submitForm.on("submit", storySubmit);

//put the user's stories on page
function putMyStoriesOnPage() {
  $myStories.empty();
    // loop through user stories and append html
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
    $myStories.show();
  }

  function getStar(story, user) {
    const isFavorite = user.isFavorite(story);
    const star = isFavorite ? "fas" : "far";
    return `
        <span class="star">
          <i class="${star} fa-star"></i>
        </span>`;
  }
  
  function getDelete() {
    return `
        <span class="delete">
          <i class="fas fa-trash-alt"></i>
        </span>`;
  }

  //delete stories
  async function deleteStory(e) {
    const $closestLi = $(e.target).closest("li");
    const storyId = $closestLi.attr("id");
    await storyList.removeStory(currentUser, storyId);
    //refresh my stories
    await putMyStoriesOnPage();
  }
  
  $myStories.on("click", ".delete", deleteStory);


//put the favorites list on page linked to nav script
function putFavoritesOnPage() {
  //start empty on click
  $favoritedStories.empty();
  //loop through and generate html for the story/append
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoritedStories.append($story);
  }
  $favoritedStories.show();
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);
