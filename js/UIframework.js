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

document.body.onload = function() {
	$(window).bind('hashchange', function(){
		var regex = /#([\w\-]+)/;
		var hash = location.hash.match(regex);
		console.log("hash:" + hash);
		if (hash!=null && hash[1]) hash = hash[1];
		else hash = "splash";
		wetFramework.ActivateContent(hash);
	});
	$(window).trigger('hashchange');

// 	webinos.session.addListener('registeredBrowser',Timeline.init);

	$("#secondarymenu").on("click", "#btnClearTv", function(event){
		removeTvInput(true);
	});
};

var wetFramework = {
	currentPage : null,
	ActivateContent: function (name){
		var contentName = name || "splash";
		if (!this.linkMap[contentName]) contentName = "splash";
		this.currentPage = contentName;
		var page = this.linkMap[contentName];
		if (page.contentId || page.contentFrom){
			$('#content > .activeContent').removeClass("activeContent");
			if (page.contentFrom && this.linkMap[page.contentFrom]){
				page.contentId = this.linkMap[page.contentFrom].contentId;
			}
			var $contentElm = $("#"+page.contentId);
			if ($contentElm.length > 0){
				$contentElm.addClass("activeContent");
			}else{
				$("#pageNotFound").text("Content here for "+page.label).addClass("activeContent");
			}
		}
		var $secMenu = $("#secondarymenu");
		if(page.root) {
			$secMenu.attr("class",page.root);
		}
		if ($secMenu.html()=="" && page.parent && !page.btns){ // add btns at the secondary menu if the page loaded on an child page without btns.
			var foundBtnsToAdd = false;
			var parent = this.linkMap[page.parent];
			while (!foundBtnsToAdd && (typeof parent == "object")){
				if (parent.btns){
					foundBtnsToAdd = true;
					page.btns = parent.btns;
					if(!parent.parent) page.parent = false; //avoid adding useless back btn!
				}else if (parent.parent){
					parent = this.linkMap[parent.parent];
				}else{
					parent = "";
				}
			}
		}
		if (page.btns){
			$secMenu.empty();
			var $ul = $('<ul>');
			if (page.parent){
				var btn = this.linkMap[page.parent];
				if (btn)
				$ul.append(
					$("<li>").append($("<a>").attr("href","#"+btn.name).attr("id", btn.name).append($("<span>").append("< Back")))
				);
			}
			for (var i=0; i<page.btns.length; i++){
				if (typeof page.btns[i] == "object"){
					var btn = page.btns[i];
					$ul.append(
						$("<li>").append($("<a>").attr("href","#"+this.currentPage).attr("id", btn.name).append($("<span>").append(btn.label)))
					);
				}else{
					var btn = this.linkMap[page.btns[i]];
					if (!btn) continue;
					$ul.append(
						$("<li>").append($("<a>").attr("href","#"+btn.name).attr("id", btn.name).append($("<span>").append(btn.label)))
					);
				}
			}
			$secMenu.append($ul);
			$ul.attr("class", this.secondaryMenuItemClass());
			if ($("#secondarymenu a").length == 0)
				$secMenu.empty();

		}
		if (page.afterClick){
			page.afterClick();
		}
		document.body.scrollTop = 0;
	},
	secondaryMenuItemClass: function(){
		var classNames = ["unknown", "one","two","three","four","five"]
		var className = "unknown";
		var linksCount = $("#secondarymenu a").length;
		if (linksCount >=0 && linksCount <= classNames.length) className = classNames[linksCount];
		return className;
	},
	//root is currently only for the css
	linkMap: {
		splash:{
			name: "splash",
			contentId: "splash",
			btns: [],
			root: "splash"
		},
		menucreate:{
			name: "menucreate",
			label: "Create Tweet",
			contentFrom: "twitterBox",
			btns: ["twitterBox", "createUsers", /*"createMedia",*/ "createVehicle", "createRemote"],
			afterClick: function(){
			      isAlreadyAuthenticated();
			},
			root: "menucreate"
		},
		twitterBox:{
			name: "twitterBox",
			label: "Twitter Box",
			contentId: "create",
			parent: "menucreate",
			root: "menucreate"
		},
		createUsers:{
			name: "createUsers",
			label: "Contacts",
			//contentId: "wetContacts",
			//contentFrom: "twitterBox",
			parent: "menucreate",
			btns: ["createUsersDevice", "createUsersTwitter"],
			root: "menucreate"
		},
		createUsersDevice:{
			name: "createUsersDevice",
			label: "Webinos contacts",
			contentId: "wetContactsWebinos",
			parent: "menucreate",
			btns: ["createUsersDevice", "createUsersTwitter"],
			root: "menucreate"
		},
		createUsersTwitter:{
			name: "createUsersTwitter",
			label: "Twitter contacts",
			contentId: "wetContactsTwitter",
			parent: "menucreate",
			btns: ["createUsersDevice", "createUsersTwitter"],
			root: "menucreate"
		},
		createMedia:{
			name: "createMedia",
			label: "TV Media",
			contentId: "wetTvMedia",
			parent: "menucreate",
			btns:[{
				name: "btnClearTv",
				label: "Clear Media"
			}],
			root: "menucreate"
		},
		createVehicle:{
			name: "createVehicle",
			label: "Vehicle Info",
			contentId: "wetVehicleInfo",
			parent: "menucreate",
			root: "menucreate"
		},
		createDevices:{
			name: "createDevices",
			label: "Contacts devices",
			contentId: "implement_me",
			parent: "menucreate",
			root: "menucreate"
		},
		createRemote:{
			name:"createRemote",
			label: "Remote Twitter",
			parent: "menucreate",
			//contentFrom: "twitterBox",
			btns:["createRemoteFind", "createRemoteListen"],
			root: "menucreate"
		},
		createRemoteFind:{
			name: "createRemoteFind",
			label: "Remote Input",
			contentFrom: "createRemoteListen",
			parent: "createRemote",
			btns:[{
				name: "btnRemoteInput",
				label: "Start Remoting"
			}],
			afterClick:function(){
				if(isAlreadyRemoted)
					$("#btnRemoteInput").html("Stop remoting");
			},
			root: "menucreate"
		},
		createRemoteListen:{
			name: "createRemoteListen",
			label: "Listen Remotly",
			contentId: "wetRemoteListen",
			parent: "createRemote",
			btns:[{
				name: "btnListenRemoteInput",
				label: "Start Remoting"
			}],
			afterClick:function(){
				if(isListening)
					$("#btnListenRemoteInput").html("Stop remoting");
			},
			root: "menucreate"
		},
		menutwitter:{
			name: "menutwitter",
			label: "Twitter",
			contentFrom: "timeline",
			btns: ["timeline", "mentions", "messages"],
			afterClick: function(){
			      isAlreadyAuthenticated();
			},
			root: "menutwitter"
		},
		timeline:{
			name: "timeline",
			label: "Timeline",
			contentId: "timelineContentPage",
			afterClick: function(){
				 $('ul#timeline').empty();
				 TwitterHelper.getTimeline();
			},
			root: "menutwitter"
		},
		menusettings:{
			name: "menusettings",
			label: "Status",
			contentFrom: "status",
			btns: ["status", "logout"],
			afterClick: function(){
			      isAlreadyAuthenticated();
			},
			root: "menusettings"
		},
		status:{
			name: "status",
			label: "Update status",
			contentId: "splash",
			afterClick: function(){
			      $('#status_ko').css('display', 'none');
			      isAlreadyAuthenticated();
			},
			root: "menusettings"
		},
		logout:{
			name: "logout",
			label: "Logout",
			contentId: "splash",
			afterClick: function(){
			      TwitterHelper.logout();
			},
			root: "menusettings"
		}
	}

}
