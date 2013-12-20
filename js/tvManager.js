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
 * Copyright 2012, 2013
 * Author: Paolo Vergori (ISMB), Michele Morello (ISMB), Christos Botsikas (NTUA)
 ******************************************************************************/

LastTVStatus = {
	name: "",
	image: ""
};

var numTries = 0;

function locateTVServices(){
	findServiceByName('TVManager');
}

function InitTvGUI(){
 	// Select the device mechanism
	$('input[name="tvdevices"]').live('click', function(event) {
		if ($(this).is(':checked')){
			$(this).attr("checked", true);
			getScreenFromDevice();
		}
		else{
			$(this).attr("checked", false);
		}
	});
}

function removeTvInput(uncheck){
	console.log("Removing Tv device data from tweet");

	uncheck = uncheck || false;
	if (tvLastInput!=null){
		var text = GetTwitterBox().val();
		var newtext = text.replace(tvLastInput.text, "");
		if (text!=newtext){
			GetTwitterBox().val(newtext);
			var e = jQuery.Event("keydown");
			e.which = 50;
			$('#tbox').find("textarea").trigger(e);
		}
		$("#tbox").maxinput({
		      position	: 'topleft',
		      showtext 	: true,
		      limit		: 140
	      });
		LastTVStatus = {
			name: "",
			image: ""
		};
		tvLastInput = null;
		$('#mediapic').html('');
		$('#mediapic').hide();

	}
	if (uncheck){
		console.log("Unchecking device");
		var $checked = $('input[name="tvdevices"]:checked');
		$checked.checked = false;
		$checked.attr("checked", false);
	}
}
var tvLastInput = null;
function getScreenFromDevice(){
	var serviceAddress = $('input[name="tvdevices"]:checked').attr('value');
	var service = discoveredServices[serviceAddress];
	if (service!=null && (tvLastInput==null || tvLastInput.serviceAddress!=serviceAddress)){
		if (tvLastInput!=null ) removeTvInput();
		service.display.getEPGPIC({name:'dummychannel'},function(epg){
			console.log('---------<TVManager>---------');
			var pzpName = service.serviceAddress;		
			console.log("Looking for TV API in: " + pzpName);
			
//			if(pzpName.indexOf("@tv") == -1) {					    
//			  if(confirm("Is your TV " + pzpName + "?")) {
//			    GUI.showSuccess('TV ' + pzpName + ' connected');	  
			    
			    //TODO: Policy management here!!
			    
			      console.log("Binding to: " + pzpName);
			      LastTVStatus.name = epg.programName;
			      LastTVStatus.image = epg.snapShot;						
			      console.log("Found: it's watching " + epg.programName);
			      var old = GetTwitterBox().val();
			      GetTwitterBox().val(old + " I'm watching " + epg.programName);
			      tvLastInput = {'serviceAddress':serviceAddress, 'text': " I'm watching " + epg.programName};
			      var photo = epg.snapShot;
			      $('#mediapic').html('<p>I\'m watching:</p><img src=\"' +photo+'"\" width="80" height="80">');
			      $('#mediapic').show();
			      if ($("#tbox").length){			// if this is oauth scanario with the textbox
				      $("#tbox").maxinput({
					      position	: 'topleft',
					      showtext 	: true,
					      limit		: 118
				      });
			      
					//trigger event
					var e = jQuery.Event("keydown");
					e.which = 50;
					$('#tbox').find("textarea").trigger(e);
			      }
			    
//			  }
//			  else {
//			    GUI.showError('TV ' + pzpName + ' not connected');					      
//			    numTries--;
//			  }
//			}
//			else
//			  console.log("found, but it's not a STB device!");	
//			  
//			numTries++;  
//			console.log(numTries + "?=" + connectedPzp.length + " ++ " + LastTVStatus.name);
//			if(numTries == connectedPzp.length && LastTVStatus.name == "") { 
//			  GUI.showError('No TV found');
//			  numTries = 0;
//			}
//			
			console.log('---------</TVManager>---------');					
			
		});
	}
}

//find service by name and link it
var findServiceByName = function(serviceName){
    //TODO: check if serviceName is already found
	webinos.discovery.findServices(new ServiceType('http://webinos.org/api/tv'), {
		onFound: function (service) {
			if(service.serviceAddress.indexOf("@tv") == -1) return;
			else $("ul#tvdevicelist > li.removeIfFound").hide();
			discoveredServices[serviceName+"@"+service.serviceAddress] = service;
			console.log('recent TV API found: ' + service.api + ' @ ' + service.serviceAddress);
			$('<li><label for="radio1" class="tv">' + service.serviceAddress + '</label><input type="radio" name="tvdevices" value="' + serviceName+"@"+service.serviceAddress + '" /></li>').appendTo("ul#tvdevicelist");
//			if(isServiceDiscovered('TVManager','TVManager is not discovered yet.')){
//				//TODO: dummychannel it's just dummy...
//				//getEPGPIC changed on github version. needs object as channel
//				discoveredServices['TVManager'].display.getEPGPIC({name:'dummychannel'},function(epg){
//					console.log('---------<TVManager>---------');
//					var pzpName = service.serviceAddress;		
//					console.log("Looking for TV API in: " + pzpName);
//					
//					if(pzpName.indexOf("@tv") == -1) {					    
//					  if(confirm("Is your TV " + pzpName + "?")) {
//					    GUI.showSuccess('TV ' + pzpName + ' connected');	  
//					    
//					    //TODO: Policy management here!!
//					    
//					      console.log("Binding to: " + pzpName);
//					      LastTVStatus.name = epg.programName;
//					      LastTVStatus.image = epg.snapShot;						
//					      console.log("Found: it's watching " + epg.programName);
//					      var old = GetTwitterBox().val();
//					      GetTwitterBox().val(old + " I'm watching " + epg.programName);
//					      
//					      var photo = epg.snapShot;
//					      $('#mediapic').html('<p>I\'m watching:</p><img src=\"' +photo+'"\" width="80" height="80">');
//					      $('#mediapic').show();
//					      if ($("#tbox").length){			// if this is oauth scanario with the textbox
//						      $("#tbox").maxinput({
//							      position	: 'topleft',
//							      showtext 	: true,
//							      limit		: 118
//						      });
//					      
//						//trigger event
//						var e = jQuery.Event("keydown");
//						e.which = 50;
//						$('#tbox').find("textarea").trigger(e);
//					      }
//					    
//					  }
//					  else {
//					    GUI.showError('TV ' + pzpName + ' not connected');					      
//					    numTries--;
//					  }
//					}
//					else
//					  console.log("found, but it's not a STB device!");	
//					  
//					numTries++;  
//					console.log(numTries + "?=" + connectedPzp.length + " ++ " + LastTVStatus.name);
//					if(numTries == connectedPzp.length && LastTVStatus.name == "") { 
//					  GUI.showError('No TV found');
//					  numTries = 0;
//					}
//					
//					console.log('---------</TVManager>---------');					
//					
//				});
//			}
		}
	});
};

$(document).ready(function(){
	// When the browser registers, find all tv services
	webinos.session.addListener('registeredBrowser',locateTVServices);
	// Initialize the GUI handlers
	InitTvGUI();
});
