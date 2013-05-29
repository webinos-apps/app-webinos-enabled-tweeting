/*******************************************************************************
 *  Code contributed to the webinos project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2013 EPU-National Technical University of Athens
 * Author: Paolo Vergori (ISMB), Michele Morello (ISMB), Christos Botsikas (NTUA)
 ******************************************************************************/

var textValue = "";
var isAlreadyRemoted = false;

function INITremoteGUI() {
	
        $("#btnRemoteInput").live('click', function() {
        	if(!isAlreadyRemoted) {
				isAlreadyRemoted = true;
        		$("#btnListenRemoteInput").hide();
	       		$("#btnRemoteInput").html("Stop remoting");
	       		
	       		//$('#tbox').find("input").attr("disabled", "disabled");
        		     
       			$("ul#remoteDevicesList").html("<li style='height:auto;'><p>Select device you want to input to:</p></li>");
        		findService_Events("events");
        	}
        	else {	//stop remoting
        		isAlreadyRemoted = false;
        		$("#btnListenRemoteInput").show();
        		$("#btnRemoteInput").html("Remote your input");
        		//TODO: unbind pzp
        		location.reload();  //TODO: remove this. Instead unbind all bindings.
        	}  
 		});
        
        $('input[name="radioevent"]').live('click', function(event) {
                if ($(this).is(':checked')){
                    $(this).attr("checked", true);
                    bindEventService();
		    
// 		    console.log("!!!!!!!!!!!!!!!!!!!!!!");
// 		    console.log(event);
// 		    console.log("!!!!!!!!!!!!!!!!!!!!!!");
		    
                    //checkChanges();
                    setTimeout(checkChanges, 1000); //TODO: remove setTimeout?
                }
                else{
                    $(this).attr("checked", false);
                    //TODO: unbind checkChanges
                }
        });
        
        $('#send').bind('click', function() {
            var ev = eventAPIToUse.createWebinosEvent();
	    //TODO: ev.type = "input";
            ev.payload = $("#textOut").val();
            //console.log(ev.payLoad);
            ev.dispatchWebinosEvent(callback);
        });
}


/*function findService_Events(serviceName){

        webinos.ServiceDiscovery.findServices(new ServiceType('http://webinos.org/api/events'), {
                onFound: function (service) {
                        discoveredServices[serviceName] = service;
                        console.log('<li>recent' + serviceName + 'API found: ' + service.api + ' @ ' + service.serviceAddress + '</li>');
						var i;
                            if(typeof connectedPzp !== "undefined") {
                            	$("ul#remoteDevicesList").html("");
                                for(i =0; i < connectedPzp.length; i++) { 
                                    $('<li><label for="radio1" class="pc">' + connectedPzp[i] + '</label><input type="radio" name="radioevent" value="' + connectedPzp[i] + '" /></li>').appendTo("ul#remoteDevicesList");
                                }
                            }
			    else
				console.log("WARNING: connectedPzp = " + connectedPzp);
                        }
        });
};*/

/*function bindEventService() {
        var serviceAddress = $("input[@name=radioevent]:checked").attr('value');
        console.log(serviceAddress);
        discoveredServices['events'].bind(function() {
        	discoveredServices['events'].createWebinosEvent();
        })
}*/

function checkChanges() {
  
	$('#tbox').find("textarea").bind("keyup keydown paste", function(e){
	    if ($(this).val() != textValue)
	    {
	        // text has changed
	        console.log("EventAPI.send( " + $(this).val() + " )");

  	        textValue = $(this).val();
  	        
            var ev = discoveredServices['events'].createWebinosEvent(); //TODO: check if this is needed due to the use of bindEventService.
            ev.payload = textValue;
	    ev.type = "tweetText";
            ev.dispatchWebinosEvent();
	    }    
	});
	
	//fallback withTimeouts
	/*if ($('#tbox').find("textarea").val() != textValue) {
		textValue = $('#tbox').find("textarea").val();
  	        
        var ev = discoveredServices['events'].createWebinosEvent();
        ev.payload = textValue;
        ev.dispatchWebinosEvent();

		//alert("sent: "+textValue);
	}
	setTimeout(checkChanges, 2000);	*/
}


var connectedPzp = "";

$(document).ready(function(){
	INITremoteGUI();

        function fillPZAddrs(data) { 
            console.log('Filling PZPs....');
	    
	    console.log(data.payload.message.connectedPzp);
	    
            if(data.from !== "virgin_pzp") {
                connectedPzp = data.payload.message.connectedPzp;
                console.log(data.payload.message.connectedPzp);
                console.log(connectedPzp);
            }	  
            if (connectedPzp.length === 0) {
                //connectedPzp[0] = data.from;
                connectedPzp = data.from;
//                $("#btnListenRemoteInput").hide();
//                $("#btnRemoteInput").hide();
            } /*else {
                connectedPzp[connectedPzp.length+1] = data.from;
                console.log(connectedPzp);
            }*/
            console.log(connectedPzp);
            console.log('DONE!');
        }
        webinos.session.addListener('registeredBrowser', fillPZAddrs);
});




