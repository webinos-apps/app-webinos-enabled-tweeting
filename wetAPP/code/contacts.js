function usrsToEmailTo(addr) {
	this.address = addr;
	this.name = null;
	this.verified = false;
}

var usrEmails = new Array();

function InitGUI(){
    //Hide the reporting divs
	$('.successbox').hide();
	$('.errormsgbox').hide();
	$('#mediapic').hide();

	// Setup the contact selection mechanism
	$("input:checkbox").live('click', function(event) {
        var old = "";
		if ($(this).is(':checked')){
			$(this).attr("checked", true);
			old = GetTwitterBox().val();
			var flag = false;
				for(var i=0;i<usrEmails.length;i++) {
					if(usrEmails[i].address == $(this).attr("id")) { //check to list
						flag = true;
						var message = $(this).attr("value") + " has no Twitter account set. " + "Send an email to: " + $(this).attr("id")+" ?";
						if(confirm(message)) {
							usrEmails[i].verified = true;
							usrEmails[i].name = $(this).attr("value");
						}
						else { //uncheck from list
							$(this).attr("checked", false);
							console.log("contact " + $(this).attr("value") + " will NOT be emailed to: " + $(this).attr("id"));
						}
					}
					else {
						//GetTwitterBox().val(old + ""+$(this).attr("id") + " ");
					}
				}
				if(!flag){ //add to the textArea if it's not an email address
					GetTwitterBox().val(old + ""+$(this).attr("id") + " ");
					
					GetTwitterBox().trigger('keyup');
					
					if(isListening || isAlreadyRemoted) {					  
					  var ev = discoveredServices['events'].createWebinosEvent();
					  ev.payload = $(this).attr("id");
					  ev.type = "contactChecked";
					  ev.dispatchWebinosEvent();					  
					}
				}
		} else {
			$(this).attr("checked", false);
			old = GetTwitterBox().val();
			var newString = old.replace(""+$(this).attr("id"), "");
			GetTwitterBox().val(newString);
			
			//TODO: delete element from usrEmails
			for(var i=0;i<usrEmails.length;i++) {
				if(usrEmails[i].address == $(this).attr("id"))
					usrEmails[i].verified = false;
			}
			
			if(isListening || isAlreadyRemoted) {
			  var ev = discoveredServices['events'].createWebinosEvent();
			  ev.payload = $(this).attr("id");
			  ev.type = "contactUnchecked";
			  ev.dispatchWebinosEvent();
			}
		}
		
	});

	// Select the device mechanism
	$('input[name="radiogroup"]').live('click', function(event) {
		if ($(this).is(':checked')){
			$(this).attr("checked", true);
			bindSelectedService();
		}
		else{
			$(this).attr("checked", false);
		}
	});

//	$('#btnGetMedia').bind('click', function() {
//		findServiceByName('TVManager');
//	});

}

function GetTwitterBox(){
	return $('#tbox iframe').contents().find("textarea");
}

var discoveredServices = [];

//check if service is present already
var isServiceDiscovered = function(serviceName,serviceNotFoundMessage){
	if(discoveredServices[serviceName]==null && serviceNotFoundMessage){
		alert(serviceNotFoundMessage);
	}
	return discoveredServices[serviceName]!=null;
};

// CBOT Changes are from HERE

// Common GUI functions
var GUI = { 
	showSuccess: function(text){
		$(".errormsgbox").hide();
		$('.successbox').text(text);
		$(".successbox").fadeIn(700);
	},
	showError: function(text){
		$(".successbox").hide();
		$(".errormsgbox").text(text);
		$(".errormsgbox").fadeIn(700);
	}
};

// Callback function when a service is found
function onFoundService(service){
	console.log("Contacts service: ",service," found!!");
	// Add the new service in the selection menu
	$('<li><label for="radio1" class="mobile">' + service.serviceAddress + '</label><input type="radio" name="radiogroup" value="' + service.serviceAddress + '" /></li>').appendTo("ul#devicelist");
}

// Callback in case binding fails (mainly if the service is not found)
function serviceBindFailCallback(serviceAddress){
	GUI.showError('You need to choose webinos device!');
}

// Callback for succesful contact service binding
function serviceBindSuccessCallback(service){
	console.log('CONTACTS API ' + service.api + ' bound.');
	GUI.showSuccess('Bind Service - successful');
	// Authenticate to the bound service
	doAuthenticate();
}

// Bind and activate a GUI selected service
function bindSelectedService() {
	console.log("********************* Bind button clicked!!!!************");
	var serviceAddress = $('input[name="radiogroup"]:checked').attr('value');
	ContactsHelper.bindService(serviceAddress,serviceBindSuccessCallback,serviceBindFailCallback);
}

// Authenticate to the service
function doAuthenticate() {
	if (!ContactsHelper.authenticate('/home/paolo/abook.mab',successAuthenticationCallback, errorAuthenticationCallback)){
		// Empty contacts
		document.getElementById('html_contacts').innerHTML = "";
		// Show error
		GUI.showError("PROBLEM: Service unreachable");
	}
}
// Authentication callback handler
function successAuthenticationCallback() {
	console.log('------------------Success_handle_auth : ');
    GUI.showSuccess('Authentication - successful');
    // Retrive the contacts from the service without specifying an address book.
    ContactsHelper.retrieveContacts(null, print_contact_list);
}

function errorAuthenticationCallback() {
    console.log('------------------Success_handle_auth : ');
    GUI.showError('Authentication Failed!');
}



// Prints the contacts list
function print_contact_list(list) {
  var defaultPic = "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";
	
	$('ul#contactList').html('<li><p>' + $("input[@name=radiogroup]:checked").attr('value') + ' Contacts</p></li>');
	
	//TODO: if there is no email in the list it crashes
	if (typeof list !== "undefined" && typeof list.length !=="undefined" && list.length > 0) {
		for ( var i = 0; i < list.length; i++) {
			var twitterFound = false;

            var displayName = typeof list[i].displayName !== "undefined" ? list[i].displayName : "";

            var photo;
            if (typeof list[i].photos !== "undefined" && typeof list[i].photos[0] !== "undefined")
                photo = list[i].photos[0].value;
            else
                photo = defaultPic;

			if (typeof list[i].ims !== "undefined" && typeof list[i].ims.length !=="undefined") { //if there are any ims entries (not true for the remote contacts)
				for (var j=0; j< list[i].ims.length; j++) {				 
					if ( list[i].ims[j].type === undefined ) {
						//Pick the photo or add the default unknown picture.
//						var photo = list[i].photos[0] ? list[i].photos[0].value : defaultPic;
						$('ul#contactList').append('<li><img src=\"data:image\/png;base64,' +photo+'"\" width="40" height="40"><label for="' + list[i].id + '">' + displayName +'</label><input type="checkbox" id="' + list[i].ims[j].value + '" value="' + displayName +'" /></li>');
						twitterFound = true;
					}
				}
			}
			if(!twitterFound) {
//              var photo = list[i].photos[0] ? list[i].photos[0].value : defaultPic;
                if (typeof list[i].emails !== "undefined" && typeof list[i].emails[0] !== "undefined")
                {
                    $('ul#contactList').append('<li><img src=\"data:image\/png;base64,' +photo+'"\" width="40" height="40"><label for="' + list[i].id + '">' + displayName +'</label><input type="checkbox" id="' + list[i].emails[0].value + '" value="' + displayName +'" /></li>');
                    console.log("contact " + displayName + " has no Twitter account (PROTOCOL_CUSTOM) in IMS");
                    usrEmails.push(new usrsToEmailTo(list[i].emails[0].value));
                }
            }
		}
	} 
	else {
		$('#contactList').append("<font color='#FF0000'><b>NO CONTACTS!</b></font>"); //TODO: add CSS class
	}
}

//When the document loads
$(document).ready(function(){
	// Add an event handler when we locate a contact service
	ContactsHelper.onFoundService.push(onFoundService);
	// When the browser registers, find all contact services
	webinos.session.addListener('registeredBrowser',ContactsHelper.locateContactServices);
	// Initialize the GUI handlers
	InitGUI();
});

