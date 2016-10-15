var YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
var query, nextPageToken, prevPageToken;
function getDataFromApi(pageToken, callback) {
    var settings = {
        part: 'snippet',
        key: 'AIzaSyBl-Nqw-LUE6iP-iHB3N6jPwj5uZjNVDnQ',
        q: query
    }
    if(pageToken) {
      settings.pageToken = pageToken;
    }
    $.getJSON(YOUTUBE_BASE_URL, settings, callback);
}

function displayData (data) {
  console.log(data);
  var resultElement = '';
  if (data.items) {
    data.items.filter(function(videoItem) {
      return videoItem.id.videoId !==  undefined;
    }).forEach(function(item) {
      var id = item.id.videoId;
      resultElement += '<div class ="video-thumbnail-fig"><a class ="video" href="https://www.youtube.com/watch?v='+ id+'">'+
      '<img src='+item.snippet.thumbnails.medium.url+'></a> <a href="https://www.youtube.com/channel/'+item.snippet.channelId+'" target="_blank">'+
      '<span class="channel-link">More from this Channel</span></a></div>';
    });
  }
  else {
    resultElement += '<p>No results</p>';
  }
  $(".js-search-results").html(resultElement);

  if (data.nextPageToken) {
    $(".next-page").css("visibility", "visible");
    nextPageToken = data.nextPageToken;
  }
  else {
    $(".next-page").css("visibility", "hidden");
  }
  if (data.prevPageToken) {
    $(".prev-page").css("visibility", "visible");
    prevPageToken = data.prevPageToken;
  }
  else {
    $(".prev-page").css("visibility", "hidden");
  }
}

function onSearch() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    console.log("hello");
    query = $('input').val();
    getDataFromApi(undefined, displayData);
  });
}
function nextPage() {
  getDataFromApi(nextPageToken, displayData);
}
function prevPage() {
  getDataFromApi(prevPageToken, displayData);
}

function lightBox() {
  var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match;
  $(".js-search-results").on("click", ".video", function(event) {
    event.preventDefault();
    match = $(this).attr('href').match(regExp);
    $(".lightbox-dark, .lightbox-light").css("visibility","visible");
    $(".lightbox-light").html("<iframe width='560' height='315' src='https://www.youtube.com/embed/"+match[2]+"' frameborder='0' allowfullscreen></iframe>");
  });
  $(".lightbox-dark, .lightbox-light").click(function() {
    $(".lightbox-dark, .lightbox-light").css("visibility","hidden");
  });
}
onSearch();
lightBox();