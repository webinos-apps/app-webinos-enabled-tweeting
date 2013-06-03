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

ContactsHelper = {
   ActiveService: null, // The currently selected contact service
   AvailableServices: [], // The list of available contact services
   bindService: function(serviceAddress,successCB,failCB){
		ContactsHelper.ActiveService = ContactsHelper.AvailableServices[serviceAddress];
		if (typeof ContactsHelper.ActiveService === 'undefined') { // if the service is not discoverd yet
			// Call the not found callback
			if (typeof failCB === 'function') failCB(serviceAddress);
		}else{
			// Try to bind the service
			ContactsHelper.ActiveService.bindService({
				onBind:function(service) { // and report success
					 if (typeof successCB === 'function') successCB(service);
			}});
		}
   },
   Internal: { // Internal functions and parameters that should not be used outside this file
		useGoogleContacts: false, // Change this to true in order to get google contacts. Don't forget to set the usr and pwd a few lines later
		getContactParameters: function(addressBookLocation){
			var parameters = {};
			parameters.fields = {};
			if (ContactsHelper.Internal.useGoogleContacts){
				// To debug without needing any file, we may load google contacts
				parameters.type = "remote";
				parameters.usr = ""; // Specify these
				parameters.pwd = "";
			}else{
				// if the user has specified an address book, set the parametes
				if (addressBookLocation) parameters.addressBookName = addressBookLocation;
				parameters.type = "local";
			}
			return parameters;
		}
   },
   authenticate: function(addressBookLocation, callback){
		if (typeof ContactsHelper.ActiveService === 'undefined') { // if no service is active yet
			return false;
		}else{
			// TODO: Fix the contacts module's bug. I may call isAlreadyAuthenticated and avoid the prompt!
			ContactsHelper.ActiveService.authenticate(ContactsHelper.Internal.getContactParameters(addressBookLocation), function(result) {
				if (typeof callback === 'function') callback(true);
			}, function(result){if (typeof callback === 'function') callback(false);});
			return true;
		}
   },
   locateContactServices: function(){ // Locate contact services
		setTimeout(function() { // Set a timeout to wait for the session initialization.
			// Reset the existing buffer
			ContactsHelper.AvailableServices = [];
			ContactsHelper.ActiveService = null;
			// Discover contacts services
			webinos.ServiceDiscovery.findServices(
				new ServiceType('http://www.w3.org/ns/api-perms/contacts'),
					{
						onFound: function (service) {
							$("ul#devicelist > li.removeIfFound").hide();
							ContactsHelper.AvailableServices[service.serviceAddress] = service;
							jQuery.each(ContactsHelper.onFoundService, function(index,fnc){
								fnc(service);
							});
						}
					});
		},400);
   },
   onFoundService: [], // The callback handlers to call when found a new service
   retrieveContacts: function(addressBookLocation,successCB){ // Retrive all contacts from the active service
		if (typeof ContactsHelper.ActiveService === 'undefined') { // if no service is active yet
			return false;
		}else{
			var parameters = ContactsHelper.Internal.getContactParameters(addressBookLocation);
			// Check if authenticated
			ContactsHelper.ActiveService.isAlreadyAuthenticated(parameters, function(result) {
				// and retrive the user list.
				ContactsHelper.ActiveService.find(parameters, successCB);
			});
		}
   }
};

