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

(function($) {
	
	$.fn.maxinput = function(options) {
		var opts = $.extend({}, $.fn.maxinput.defaults, options);
		return this.each(function() {
			$this = $(this);
			var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
			$.fn.limit(o,$this);			
		});
	};
	$.fn.maxinput.defaults = {
		limit 		: 140,
		position 	: 'topright',
		showtext  	: false,
		message     : 'characters left'
	};
	$.fn.limit = function(o,obj){
			if(!$('.jMax-text',obj).length){
				var _jMaxtext		= $(document.createElement('div')).addClass('jMax-text');
				_jMaxtext.html('<span>'+o.limit+'</span>');		
				
				if(o.position == 'topright')
					_jMaxtext.css('float','right');
				else	
					_jMaxtext.css('float','left');
				
				var _jMaxtextarea 	= $(document.createElement('textarea'));		
				
				var _jMaxsubmit	= $(document.createElement('div')).addClass('jMax-submit').css('float','right');
				var _jMaxinput		= $(document.createElement('input')).attr('id','btnSubmit').attr('type','submit').attr('disabled','true').addClass('disabled').val('Tweet');		
				
				_jMaxsubmit.append(_jMaxinput);
				
				if(o.position == 'bottomleft')
					obj.append(_jMaxtextarea).append(_jMaxtext).append(_jMaxsubmit);
				else
					obj.append(_jMaxtext).append(_jMaxtextarea).append(_jMaxsubmit);

				if(o.showtext)
					$(document.createElement('span')).html(' '+o.message).insertAfter(_jMaxtext.find('span:first'));
					
			}
			var currlength = $('textarea',obj).val().length ;
			$('.jMax-text span:first',obj).html(o.limit - currlength);
			if((currlength > 0) && (currlength <= o.limit) && (!isListening))
				$('input',obj).removeAttr('disabled').removeClass('disabled').addClass('enabled');
			else
				$('input',obj).attr('disabled','true').removeClass('enabled').addClass('disabled');
			
				
			$('textarea',obj).one('keydown',function(){
				var d = function() { obj.maxinput(o) };
				timeout = setTimeout(d,1);
			});
	} 
})(jQuery);


