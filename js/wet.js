 function contact(id) {
                    this.id = id;
                    this.screen_name; //or name?
                    this.location;
                    this.profile_image_url;
                    this.url;
                    this.followers_count;
                    this.lang;
                    this.verified;
                    this.description;
                    this.time_zone;
                    this.friends_count;
                    this.statuses_count;
                    this.status_text;
                    }

var contacts={};
var current_user;
var hiddenT;

//Twitter Authentication	
 twttr.anywhere(function (T) { //authenticate to Twitter

            var currentUser,
            screenName,
            profileImage,
            profileImageTag;

            if (T.isConnected()) {
              profileImage = "<img src='" + T.currentUser.data('profile_image_url') + "'/"+">";
              $("#login").append(profileImage + " " + T.currentUser.data('screen_name'));

              $("#logout").append('<button id="signout" class="button">Sign out from Twitter</button>');
              $("#logout").bind("click", function () {
                              twttr.anywhere.signOut();
                          location.reload();
                            });

                           $.ajax({
                    url: 'https://api.twitter.com/1/account/rate_limit_status.json',
                    data: {},
                    dataType: 'jsonp',
                    success: function(data) {
                        $('#limits').html("reqLimit: "+data.remaining_hits+", lastReset: "+data.reset_time);
                    }
                    });
              hiddenT = T;
            } else {
				T("#login").connectButton( {authComplete: function(user){location.reload();} });
			} 
			});	


//create TweetBox
  twttr.anywhere(function (T) {
				var text='';
	  			//If there are tagged users, put them into the box	  
	 			if (sessionStorage.getItem("twttr.tagged.users")){
	 				//alert ();
	 				var taggedUsrs=sessionStorage.getItem("twttr.tagged.users");
	 				
	 				for (x in taggedUsrs){
	 					
	 					if ((taggedUsrs[x]=='@')&&(x!=0)){
	 						text+=' '+taggedUsrs[x];
	 					}
	 					else if (taggedUsrs[x]==','){
	 						continue;
	 					}
	 					else{
	 						text+=taggedUsrs[x];
	 					}
	 				}			    	
			    	//T("#tbox").hovercards();
			    }
	 			if (sessionStorage.getItem("channelInfo")) {
			    	var tvChannelInfo = sessionStorage.getItem("channelInfo");
			    	sessionStorage.removeItem("channelInfo");
			    	text += tvChannelInfo;			    	
			    }
	 			T("#tbox").tweetBox({
		    		defaultContent: text
		    		}
		    	);

		  });
					