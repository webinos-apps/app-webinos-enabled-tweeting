$(document).ready(function() {
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
});

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
			var $contentElm = $("#content > #"+page.contentId);
			if ($contentElm.length){
				$contentElm.addClass("activeContent");
			}else{
				$("#content > #pageNotFound").text("Content here for "+page.label).addClass("activeContent");
			}
		}
		var $secMenu = $("#secondarymenu");
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
	},
	secondaryMenuItemClass: function(){
		var classNames = ["unknown", "one","two","three","four","five"]
		var className = "unknown";
		var linksCount = $("#secondarymenu a").length;
		if (linksCount >=0 && linksCount <= classNames.length) className = classNames[linksCount];
		return className;
	},
	linkMap: {
		splash:{
			name: "splash",
			contentId: "splash",
			btns: []
		},


		menucreate:{
			name: "menucreate",
			label: "Create Tweet",
			contentFrom: "twitterBox",
			btns: ["twitterBox", "createUsers", /*"createMedia",*/ "createVehicle", "createRemote"],
			afterClick: function(){
			      isAlreadyAuthenticated();
			}
		},
		twitterBox:{
			name: "twitterBox",
			label: "Twitter Box",
			contentId: "create",
			parent: "menucreate"
		},
		createUsers:{
			name: "createUsers",
			label: "Contacts",
			//contentId: "wetContacts",
			//contentFrom: "twitterBox",
			parent: "menucreate",
			btns: ["createUsersDevice", "createUsersTwitter"]
		},
		createUsersDevice:{
			name: "createUsersDevice",
			label: "Webinos contacts",
			contentId: "wetContactsWebinos",
			parent: "createUsers",
		},
		createUsersTwitter:{
			name: "createUsersTwitter",
			label: "Twitter contacts",
			contentId: "wetContactsTwitter",
			parent: "createUsers",
		},
		createMedia:{
			name: "createMedia",
			label: "TV Media",
			contentId: "wetTvMedia",
			parent: "menucreate",
			btns:[{
				name: "btnClearTv",
				label: "Clear Media"
			}]
		},
		createVehicle:{
			name: "createVehicle",
			label: "Vehicle Info",
			contentId: "wetVehicleInfo",
			parent: "menucreate"
		},
		createDevices:{
			name: "createDevices",
			label: "Contacts devices",
			contentId: "implement_me",
			parent: "menucreate"
		},
		createRemote:{
			name:"createRemote",
			label: "Remote Twitter",
			parent: "menucreate",
			//contentFrom: "twitterBox",
			btns:["createRemoteFind", "createRemoteListen"]
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
			}
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
			}
		},
		menutwitter:{
			name: "menutwitter",
			label: "Twitter",
			contentFrom: "timeline",
			btns: ["timeline", "mentions", "messages"],
			afterClick: function(){
			      isAlreadyAuthenticated();
			}
		},
		timeline:{
			name: "timeline",
			label: "Timeline",
			contentId: "timelineContentPage",
			afterClick: function(){
				 $('ul#timeline').empty();
				 TwitterHelper.getTimeline();
			}
		},
		menusettings:{
			name: "menusettings",
			label: "Status",
			contentFrom: "status",
			btns: ["status", "logout"],
			afterClick: function(){
			      isAlreadyAuthenticated();
			}
		},
		status:{
			name: "status",
			label: "update status",
			contentId: "splash",
			afterClick: function(){
			      $('#status_ko').css('display', 'none');
			      isAlreadyAuthenticated();
			}
		},
		logout:{
			name: "logout",
			label: "logout",
			contentId: "splash",
			afterClick: function(){
			      TwitterHelper.logout();
			}
		}
	}

}
