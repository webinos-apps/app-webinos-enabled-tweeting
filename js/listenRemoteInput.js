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

var isListening = false;

function INITlistenRemoteGUI() {

        $("#btnListenRemoteInput").live('click', function() {
        	if(!isListening) {
        		isListening = true;
	        	$("#btnRemoteInput").hide();
    	    	$("#tbox").find("textarea").attr("disabled", "disabled");
        		$("#btnListenRemoteInput").html("Stop remoting");

        		$("ul#remoteDevicesList").html("<li style='height:auto;'><p>Select device you want to input from:</p></li>");
	        	findService_Events("events");
        	}
        	else {	//stop remoting
        		isListening = false;
        		$("#btnRemoteInput").show();
        		$("#tbox").find("textarea").attr("disabled", "enabled")
        		$("#btnListenRemoteInput").html("Listen for remote input");
        		//TODO: unbind pzp
        		location.reload();
        	}
        });

        $('input[name="radioevent"]').live('click', function(event) {
                if ($(this).is(':checked')){
                        $(this).attr("checked", true);
                        bindEventService();
                }
                else{
                        $(this).attr("checked", false);
                }
        });
}



function findService_Events(serviceName){console.log("!!!!!!!!!!!!!!!!!!!!!!FINDSERVICE!!!!!!!!!!!!!!!!!!!!!!"); 
    //TODO: check if serviceName is already found
    webinos.ServiceDiscovery.findServices(new ServiceType('http://webinos.org/api/events'), {
        onFound: function (service) { 
	  console.log(service);
            discoveredServices[serviceName] = service;
	    $("ul#remoteDevicesList").html("Chose a remote device:");
//             if(typeof connectedPzp !== "undefined") {                
// 		console.log("--->" + connectedPzp);
//                 for(var i =0; i < connectedPzp.length; i++) {
//                     $('<li><label for="radio1" class="pc">' + connectedPzp[i] + '</label><input type="radio" name="radioevent" value="' + connectedPzp[i] + '" /></li>').appendTo("ul#remoteDevicesList");
//                 }
//             }
	    if(typeof service.serviceAddress !== "undefined") {                
		console.log("--->" + service.serviceAddress);
                    $('<li><label for="radio1" class="pc">' + service.serviceAddress + '</label><input type="radio" name="radioevent" value="' + service.serviceAddress + '" /></li>').appendTo("ul#remoteDevicesList");		    
            }
        }
    });
}



function bindEventService() {
        var serviceAddress = $("input[@name=radioevent]:checked").attr('value');
        console.log(serviceAddress);
        discoveredServices['events'].bind(function() {
                discoveredServices['events'].createWebinosEvent();
        });
        discoveredServices['events'].addWebinosEventListener(function (event) {
            console.log("New event received");
	    console.log(event);
            if(isListening==true && event.type == "tweetText") {
            	$('#tbox').find("textarea").val(event.payload);
            	$('.jMax-text span:first').html($.fn.maxinput.defaults.limit - event.payload.length); //TODO: replace this with trigger event on textarea.
            }
            else
	      console.log("-----------------EVENT IGNORED!---------------------");
            
            var twitterContacts = $('#friendsList').find('li').find('input');		//TwitterContactsRawList
	    var androidContacts = $('#contactList').find('li').find('input');		//AndroidContactsRawList
            
            if(isListening==true && event.type == "contactChecked") {
	           
	      if(androidContacts !== undefined) {
		for(var i=0;i<androidContacts.length;i++){
		  if(androidContacts[i].id == event.payload)
		     $(androidContacts[i]).attr("checked", true);
		}
	      }
	      
	      if(twitterContacts !== undefined) {
		for(var i=0;i<twitterContacts.length;i++){
		  if(twitterContacts[i].id == event.payload)
		    $(twitterContacts[i]).attr("checked", true);
		}
	      }     
 	    }
	    
	    if(isListening==true && event.type == "contactUnchecked") {
	      
	      if(androidContacts !== undefined) {
		for(var i=0;i<androidContacts.length;i++){
		  if(androidContacts[i].id == event.payload)
		     $(androidContacts[i]).attr("checked", false);
		}
	      }
	      
	      if(twitterContacts !== undefined) {
		for(var i=0;i<twitterContacts.length;i++){
		  if(twitterContacts[i].id == event.payload)
		    $(twitterContacts[i]).attr("checked", false);
		}
	      }     
	    }
        });
}


var connectedPzp = "";

$(document).ready(function(){
        INITlistenRemoteGUI();

        /*function fillPZAddrs(data) {
            console.log('Filling PZPs....');
            if(data.from !== "virgin_pzp") {
                connectedPzp = data.payload.message.connectedPzp;
            }
            if (connectedPzp.length === 0) {
                connectedPzp[0] = data.from;
            } //else { connectedPzp[connectedPzp.length+1] = data.from;}
            console.log('DONE!');
        }
        webinos.session.addListener('registeredBrowser', fillPZAddrs);*/
});

