$(function(){
  var tweets;
  $.getJSON("http://www.twitter.com/statuses/user_timeline/jethrolarson.json?count=5&callback=?",
		function(data){
			var t = this;
      tweets = data;
      loadTweet(0);
		}
	);
  function loadTweet(i){
    if(tweets){
      $("#tweetContent").text(tweets[i].text);
      $("#tweetDate").attr("href","https://twitter.com/jethrolarson/status/"+tweets[i].id)
        .text(relative_time(tweets[i].created_at));
    }
  }
	$("#tweet").ajaxError(function(){$(this).append("Twitter failed loading");});
	//$(".tooltip").zenTooltip();
});


// function lifted from http://remysharp.com/2007/05/18/add-twitter-to-your-blog-step-by-step/
function relative_time(time_value) {
	var values = time_value.split(" ");
	time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
	var parsed_date = Date.parse(time_value);
	var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	delta = delta + (relative_to.getTimezoneOffset() * 60);
	
	var r = '';
	if (delta < 60) {
	    r = 'less than a minute ago';
	} else if(delta < 120) {
	    r = 'about a minute ago';
	} else if(delta < (45*60)) {
	    r = (parseInt(delta / 60)).toString() + ' minutes ago';
	} else if(delta < (2*90*60)) { // 2* because sometimes read 1 hours ago
	    r = 'about an hour ago';
	} else if(delta < (24*60*60)) {
	    r = 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
	} else if(delta < (48*60*60)) {
	    r = '1 day ago';
	} else {
	    r = (parseInt(delta / 86400)).toString() + ' days ago';
	}
	
	return r;
}
