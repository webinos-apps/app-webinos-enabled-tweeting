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

function INITvehicleGUI() {

// $("#btnVehicleInfo").bind('click', function() {
//    VehicleHelper.init();
//    for ( var i = 0; i < connectedPzp.length; i++) {
//       if (connectedPzp[i].indexOf("@car") != -1) {
//          VehicleHelper.availableServices[VehicleHelper.availableServices.length] = connectedPzp[i];
//          if (confirm("Is your car " + connectedPzp[i] + "?")) {
//             GUI.showSuccess('Vehicle ' + connectedPzp[i] + ' connected');
//             VehicleHelper.connectTo = connectedPzp[i];
//          } else
//             GUI.showError('Vehicle ' + connectedPzp[i] + ' not connected');
//       }
//    }
//    if (VehicleHelper.availableServices.length == 0)
//       GUI.showError('No Vehicle found');
//    else if (VehicleHelper.connectTo !== null) {
//       console.log("Binding to: " + VehicleHelper.connectTo);
//       // verify if the chosed pzp has a vehicle API
//       // already discovered
//       VehicleHelper.locateVehicleAPI();
//    }
// });
}

function onFoundVehicleAPI(service) {
   console.log("Service: ", service, " found!!");
}

function postVehicleInfo(data) {
   GUI.showSuccess('Vehicle infomation added to your tweet');

   if ($('#tbox').find("textarea").val().length < 19) {
      $('#tbox').find("textarea").val(
         $('#tbox').find("textarea").val()
         + "I'm driving at the avg speed of "
         + data.averageSpeed1 + " km/h and I've driven for "
         + data.tripDistance
         + " kms, so far, with the average consumption of "
         + data.averageConsumption1 + " l/100kms"
      );
   } else
      if(!isAndroid) alert("Vehicle information won't be added. Too few characters left.");

   var e = jQuery.Event("keydown");
   e.which = 50;
   $('#tbox').find("textarea").trigger(e);

   console.log(data);
}

VehicleHelper = {
   availableServices : [],
   bindService : null,
   connectTo : null,
   init : function() {
      VehicleHelper.availableServices = [];
      VehicleHelper.serviceBindings = [];
      VehicleHelper.connectTo = null;
      VehicleHelper.status = null;
   },
   locateVehicleAPI : function() {

      webinos.discovery.findServices(new ServiceType('http://webinos.org/api/vehicle'), {
         onFound : function(service) {
            //if(service.serviceAddress.indexOf("@car") == -1) return;
            //else
            $("ul#vehicledevicelist > li.removeIfFound").hide();

            VehicleHelper.availableServices[service.serviceAddress] = service;
            console.log('recent vehicle API found: ' + service.api + ' @ ' + service.serviceAddress);
            $('<li><label for="radio1" class="car">' + service.serviceAddress + '</label><input type="radio" name="vehicledevices" value="' + service.serviceAddress + '" /></li>').appendTo("ul#vehicledevicelist");

//          // TODO: showError if chosen PZP@car doesn't have vehicle API
         }
      });

   },
   getInfoFromDevice: function(){
      VehicleHelper.connectTo = $('input[name="vehicledevices"]:checked').attr('value');
      var service = VehicleHelper.availableServices[VehicleHelper.connectTo];
      if (service!=null){
         var boundService = VehicleHelper.serviceBindings[VehicleHelper.connectTo];
         if (boundService!=null){
            service.get("tripcomputer", postVehicleInfo, function() {
               if(!isAndroid) alert("Error!");
            });
         }else{
            service.bindService({
               onBind: function(boundService){
                  if (boundService!== undefined){
                     VehicleHelper.serviceBindings[VehicleHelper.connectTo] = boundService;
                     console.log('Vehicle bound to' + VehicleHelper.connectTo);
                     console.log(boundService);
                     service.get("tripcomputer", postVehicleInfo, function() {
                        if(!isAndroid) alert("Error!");
                     });
                  }else{
                     if(!isAndroid) alert("Error!");
                     console.log('Vehicle cannot bind to ' + VehicleHelper.connectTo);
                  }
               }
            })
         }
      }

   },

   onFoundService : [],
   status : null
}

$(document).ready(function() {
// INITvehicleGUI();
   VehicleHelper.init();
   ListenForRegistered(VehicleHelper.locateVehicleAPI);
   $('input[name="vehicledevices"]').live('click', function(event) {
      if ($(this).is(':checked')){
         $(this).attr("checked", true);
         VehicleHelper.getInfoFromDevice();
      }
      else{
         $(this).attr("checked", false);
      }
   });
});
