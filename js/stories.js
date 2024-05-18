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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
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
async function storySubmit(evt) {
  evt.preventDefault();
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
