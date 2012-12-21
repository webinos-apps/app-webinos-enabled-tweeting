Timeline = {
	localPzpAddress: null,
	isReady: false, // TODO: Check if service is ready before calling stuff...
	oAuthService: null,
	init: function(message) {
		// Keep track of the local device address
		Timeline.localPzpAddress = message.from;
		// Discover the oAuth service
		setTimeout(function() { // Set a timeout to wait for the session initialization. 
			webinos.ServiceDiscovery.findServices(new ServiceType('http://webinos.org/mwc/oauth'), 
			{
                onFound: function (service) {
                    // Keep only the service from the local device
                    if (service.serviceAddress == Timeline.localPzpAddress){
                        Timeline.oAuthService = service;
                        Timeline.oAuthService.init("https://twitter.com/oauth/request_token",
                            TwitterHelper.Secrets.consumer_key, TwitterHelper.Secrets.consumer_secret, window.location.href,
                            function(data){ // Success callback
                                Timeline.isReady = true;
                                // Retrieve contacts from twitter
                                Timeline.getTimeline();
                            }, function(errorCode){ // Error callback
                                Timeline.isReady = false;
                            });
                    }
                }
			}
		)},200);	
	},
	getTimelineInfo: function(data, timelineHandlerCB){
		console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
		console.log(data[0].user.profile_image_url);
		jQuery.each(data,function(index, data){
			timelineHandlerCB(data);
		});
		console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
	},
	addTimelineToList: function(data){
		$('ul#timeline').append('<li><a href="#"><img src="' + data.user.profile_image_url  + '">' + '<h3>' + data.user.name +' <span>' + "@"+data.user.screen_name + '</span></h3><p>' + data.text + '</p>' + '<p class="date">' + data.created_at + '</p>' + '</a></li>');
	},
	
	getTimeline: function() {
		Timeline.oAuthService.get(/*"https://api.twitter.com/1/statuses/home_timeline.json?include_entities=true"*/"https://api.twitter.com/1/statuses/friends_timeline.json?include_entities=true&count=10", TwitterHelper.Secrets.access_token, TwitterHelper.Secrets.access_token_secret, function(data){
			
			data = JSON.parse(data);
			console.log('---------------------------------------------------------------------------------------------------');
			console.log(data.length);
			console.log(data);
			console.log('---------------------------------------------------------------------------------------------------');

			Timeline.getTimelineInfo(data, Timeline.addTimelineToList);
			 for(var i=0; i<data.ids; i++) {
				 log('<li>Dato from : ' + data[i].user.screen_name + ' said: ' + data[i].text + '</li>');
			 }
		}, function(errorcode){
			console.log('Error getting followers ids :' + errorcode);
		}
		);
	}
};