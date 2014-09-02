var highest = 10;
var lowest = 10;
var textupdate = 1;
var value=0;
var recovercrop=0;
var x1=0;
var x2=0;
var y1=0;
var y2=0;
var candelete=1;
var timeoutId = 0;


// DJANGO hack to be able to post with CSRF
// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
// DONE DJANGO HACK

function undoRedo(is_redo){
    if (is_redo != "True"){
        is_redo = "False";
    }

    var prefix = get_site_prefix();
    var interface_id = get_interface_id();
    $.ajax({
        type: "POST",
        url: prefix + "undoRedo/", 
        data: { 
            interface_id: interface_id, 
            is_redo: is_redo
        },
        success: function(data){
           console.log(data);
		   var act=data['action'];
		   var wid=data['widget'];
		   console.log(act);
		   if(act=="update"){
		   var which=wid['pk'];
		   var wtop=wid['top'];
		   var wleft=wid['left'];
		   var wheight=wid['height'];
		   var wwidth=wid['width'];
		   var wvalue=wid['value'];
		   
		   var selector = "div[widget-id*='" + which + "']" ;
		   var updatew=$(selector)[0];
		   console.log(updatew);
		  
		   var content=$(updatew).find('.widget-content')[0];
		   console.log(content);
		   $(content).replaceWith(wvalue);
		   
           $(updatew).css('top',wtop);
           $(updatew).css('left',wleft);
           $(updatew).css('height',wheight);
		   $(updatew).css('width',wwidth);
		   //content.attr('outerHTML',wvalue);
        }
		 
		  if(act=="delete"){
		    var which=wid['pk'];
			var selector = "div[widget-id*='" + which + "']" ;
		    var delatew=$(selector)[0];
		    deleteWidget(delatew);
		  }
		  
		  if(act=='create'){
		    var which=wid['pk'];
			var selector = "div[widget-id*='" + which + "']" ;
            var createw=$(selector)[0];   
			
			$(createw).css('visibility','visible');	
		    
		  
		  }
    }
    });
	
}


function undo(){
    undoRedo("False");
}

function redo(){
    undoRedo("True");
}

function get_interface_id(){
    var href = $(location).attr("href");
    var vals = href.split('/');
    return  vals[vals.length - 3];
}

function get_site_prefix(){
    var href = $(location).attr("href");
    var vals = href.split('/');
    var prefix = "/";
    if (vals[3] == vals[vals.length-5]){
        prefix = prefix + vals[3] + "/";
    }
    return prefix
}

function get_user_id(){
    var href = $(location).attr("href");
    var vals = href.split('/');
    return  vals[vals.length - 2];
}



function createWidget(widget){
    var prefix = get_site_prefix();
    var interface_id = get_interface_id();
    $.ajax({
        type: "POST",
        url: prefix + "createWidget/", 
        data: { 
        interface_id: interface_id, 
        value: $(widget).find(".widget-content")[0].outerHTML, 
        top: $(widget).css('top'), 
        left: $(widget).css('left'), 
        width: $(widget).css('width'), 
        height: $(widget).css('height')},
        success: function(data){
            $(widget).attr('widget-id', data['pk']);
            console.log(data);
        },
    });
}

function updateWidget(widget){
    if(textupdate==1){
    var prefix = get_site_prefix();
    $.ajax({
        type: "POST",
        url: prefix + "updateWidget/", 
        data: { 
            widget_id: $(widget).attr('widget-id'), 
        value: $(widget).find(".widget-content")[0].outerHTML, 
        top: $(widget).css('top'), 
        left: $(widget).css('left'),
        width: $(widget).css('width'),
        height: $(widget).css('height')
        },
        success: function(data){
            console.log(data);
        },
    });
}
}

function deleteWidget(widget){
    var prefix = get_site_prefix();
    $.ajax({
        type: "POST",
        url: prefix + "deleteWidget/", 
        data: { widget_id: $(widget).attr('widget-id') },
        success: function(data){
            console.log(data);
        },
    });
    $(widget).css('visibility','hidden');
} 

function makeEditable(event){
    textupdate=0;
    editableText = $("<textarea />");
	$(editableText).attr('wrap','hard');
    $(editableText).css("width","100%");
    $(editableText).css("height","100%");
	editableText.val($(this).text());
    $(this).replaceWith(editableText);
	candelete=0;
    $(editableText).focus();
    $(editableText).change(function(){
        $(this).blur();
    });
    $(editableText).focusout(function(event, ui){
        var uneditableText = $("<div/>");
        uneditableText.addClass("text-oneline");
		uneditableText.addClass("fontsize");
        uneditableText.text($(this).val());
        $(this).replaceWith(uneditableText);
        candelete=1;
        widget = $(uneditableText).parent();
        while (!widget.attr('widget-id')){
            widget = widget.parent();
        }
        $(uneditableText).dblclick(makeEditable);
		textupdate=1;
        updateWidget(widget);
		
    });
}

function makeListEditable(event){
    textupdate=0;
    editableText = $("<textarea />");
    $(editableText).css("width","100%");
    $(editableText).css("height","100%");
    var text = "";
    var elements = $(this).find("li");
    for(var i = 0; i < elements.length; i++){
        if (i > 0){
            text += "\n";
        }
        console.log(elements[i]);
        text += $(elements[i]).text();
    }

    //editableText.val($(this).text());
    editableText.val(text);

    $(this).replaceWith(editableText);
	candelete=0;
    $(editableText).focus();
    $(editableText).change(function(){
        $(this).blur();
    });
    $(editableText).focusout(function(event, ui){
        var uneditableText = $("<ul/>");
        uneditableText.addClass("edit-list");
		uneditableText.addClass("fontsize");
		//uneditableText.attr('style',"list-style: none;");
        var lines = $(this).val().split('\n');
        for (var i = 0; i < lines.length; i++){
            var element = $("<li/>");
            element.text(lines[i]);
            uneditableText.append(element);
        }
        $(this).replaceWith(uneditableText);
		candelete=1;
        widget = $(uneditableText).parent();
        while (!widget.attr('widget-id')){
            widget = widget.parent();
        }
        $(uneditableText).dblclick(makeListEditable);
		textupdate=1;
        updateWidget(widget);
    });
}


function makeTextEditable(event){
    textupdate=0;
    editableText = $("<textarea />");
	$(editableText).attr('wrap','hard');
    $(editableText).css("width","100%");
    $(editableText).css("height","100%");
	editableText.val($(this).text());
    $(this).replaceWith(editableText);
	candelete=0;
    $(editableText).focus();
    $(editableText).change(function(){
        $(this).blur();
    });
    $(editableText).focusout(function(event, ui){
        var uneditableText = $("<div/>");
        uneditableText.addClass("text-newline");
		uneditableText.addClass("fontsize");
        uneditableText.text($(this).val());
        $(this).replaceWith(uneditableText);
        candelete=1;
        widget = $(uneditableText).parent();
        while (!widget.attr('widget-id')){
            widget = widget.parent();
        }
        $(uneditableText).dblclick(makeTextEditable);
		textupdate=1;
        updateWidget(widget);
		
    });
}


function setDepthFront(widget){
    $(widget).bringToTop();
    $(widget).find('.widget-content').attr("depth", $(widget).css('z-index'));

}

function setDepthBottom(widget){
    $(widget).bringToBottom();
    $(widget).find('.widget-content').attr("depth", $(widget).css('z-index'));

}


function moveSelected(ol, ot){
    console.log("moving to: " + ol + ":" + ot);
    selectedObjs.each(function(){
        $this =$(this);
        var p = $this.position();
        var l = p.left;
        var t = p.top;
        // console.log({id: $this.attr('id'), l: l, t: t});


        $this.css('left', l+ol);
        $this.css('top', t+ot);
        //updateWidget(this);
    })
}

function bringtofront(event,ui){
    setDepthFront($(this));
}

function bringtoBottom(event,ui){
    setDepthBottom($(this));
}

function changeImage(event,ui)
{
    var images=new Array(' http://pb-i4.s3.amazonaws.com/photos/365451-1405284777-3.jpg ',' http://pb-i4.s3.amazonaws.com/photos/365451-1405284877-1.jpg ');
    document.getElementById("picture").src=images[x];
    x++;
    if(x==1){
        x=0;
    }
}



function func1(e,e1){
   
    setDepthFront($(e1));
    updateWidget($(e1));
}

function func8(e,e8){
    setDepthBottom($(e8));
    updateWidget($(e8));

}





function func2(event,e2){
  var a=0;
  
  $(e2).addClass('ongoingcrop');
  $(e2).imgAreaSelect({
  enable:true,
  handles: true,
  onSelectEnd: function (img, selection) {
            recovercrop=0;
			
             x1=selection.x1;
             x2=selection.x2;
             y1=selection.y1;
             y2=selection.y2;
            console.log(x1,x2,y1,y2);
			 
	
 }
 
 });
 $(document).keydown( function(event,e2) {
             if (event.keyCode == 13 ||event.which==13) {
			 var image=$(this).find('.ongoingcrop')[0];
			  var k='position:absolute; clip:rect('+y1+'px,'+x2+'px,'+y2+'px,'+x1+'px)';

             console.log(k);
			$(image).attr("style",k);
			
			
			var par=$(image).parent();
            updateWidget(par);		
           $(image).imgAreaSelect({
			
			remove:true});
			
			
            $(image).removeClass('ongoingcrop');
            }
		
		});
} 

function func3(e,e3){
    var textchange=$(e3).find(".text-newline");
	
	var textchange2=$(e3).find('.text-oneline');
	var textlistchange=$(e3).find('.edit-list');
	//console.log($(e3).find('.fontsize').css('font-size'));
    var fontsize = prompt('input the font-size (px) :',parseInt($(e3).find('.fontsize').css("font-size")));
    
    if (fontsize) {
        console.log("Your fontsize is: " +  fontsize);
        textchange.attr("style","font-size:"+fontsize+'px');
		textchange2.attr('style','font-size:'+fontsize+'px');
		textlistchange.attr("style","font-size:"+fontsize+'px');
    }
    else {console.log("You pressed Cancel or no value was entered!");
    }
    updateWidget($(e3));
}

function func5(e,e5){
   var value=parseInt($(e5).attr('rotate'));
   value=value+parseInt(45);
   if(value>360){
   value=value-parseInt(360);
   }
   console.log(value);
   $(e5).rotate({ animateTo:value});
   pa=$(e5).parent();
   $(e5).attr("rotate", value);
   updateWidget(pa);
       
}

function func6(e,e6){
   var value=parseInt($(e6).attr('rotate'));
   value=value-parseInt(45);
   
   $(e6).rotate({ animateTo:value});
   pa=$(e6).parent();
   $(e6).attr("rotate", value);
   updateWidget(pa);
   
}

function checkdelete(e,ui)
{
    var e = window.event || e;
    var code = e.which || e.keyCode;
    deletewidget=$(".selected");
	if(code == 13){
	recovercrop=1;
	
	}
	
			
		
    if(code == 46 ||code == 8)
    {

        var number=$(".selected").size();
		if(candelete==1){
        for(var i=0;i<number;i++){
            deleteWidget(deletewidget[i]);
        }
	   }
    }
}


function fonthelp(){
	alert('You can do the following things to this item\n 1.Bring to front/Bottom: Right-click the item and click the  [bring to front/bottom] button\n 2. Change font: Right-click the item and input the font-size  \n 3.Change the text color: Select the item first (with red edges), then click the [text-color] button at the top-right corner to choose color.\n 4.Change the background: Select the item first, then click the [paint-bucket] button .\n 5.For list: Everytime you input a new line in the textarea, a dot will be automatically added! ');
	
}

function iphonehelp(){
	alert('You can do the following things to this item\n 1.Bring to front/Bottom: Right-click the item and click the  [bring to front/bottom] button\n 2.Resize: Drag the right-bottom corner of the item. Press ［shift］ to fix aspect ratio.');
	
}

function arrowhelp(){
	alert('You can do the following things to this item\n 1.Clockwise-Rotate: Right-click the item and click the  [Clockwise-Rotate] button\n 2.Counterclockwise-Rotate: Click the [Counterclockwise]button.');
}

function crophelp(){
	alert('You can do the following things to this item\n 1.Crop: Right-click the item and click the  [Crop] button. Then drag the window to cover what you want to crop.When you finish, press [enter] on your keyboard.\n 2.Resize: Drag the right-bottom corner of the item. Press ［shift］ to fix aspect ratio.')}


function get_browser(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return 'IE '+(tem[1]||'');
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return 'Opera '+tem[1];}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return M[0];
    }
    
function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return  hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

$(function () {

    // BEGIN DJANGO AJAX
    // Call the functions for the DJANGO, so you can do AJAX
    var csrftoken = getCookie('csrftoken');
    var ctrlpress=0;
    var value=0;
    var test = 5;
    var settings={
        aspectRatio:1
    };
    var x=1;
    var left =[];
    var top=[];
    for (var i = 0; i < 20; i++) left[i] = 0;
    for (var i = 0; i < 20; i++) top[i] = 0;
    var selectone;
   
  
    //var addmy=$(".existing-widget").find("#addown");
    var browser=get_browser();
    console.log(browser);
   
   

	
       var rx = /INPUT|SELECT|TEXTAREA/i;

    $(document).bind("keydown keypress", function(e){
        if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                e.preventDefault();
            }
        }
    });
   
    $( "#dialog" ).dialog({
      autoOpen: false,
	  width:1000,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });
    $( "#dialog2" ).dialog({
      autoOpen: true,
	  width:1300,
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
	
	
    $('#help').click(function(){
	//alert('Operating Guidance\n 1.Drag and Drop: Drag the element from the item bar to the canvas. Select the element(with red edges means selected ) and click delete on your keyboard');
    $( "#dialog" ).dialog('open');
	
	});
	

    $('#picker').colpick({
	

    submit:0,
    onShow:function(hsb,hex,rgb,el){
	    var select=$('.selected');
	    var color=$(select[0]).find('.backcolor').css("background-color");
	    console.log(color);
	    if(color!="rgba(0, 0, 0, 0)"){ 
	    $('#picker').colpickSetColor(rgb2hex(color));}
	    else{$('#picker').colpickSetColor('ffffff');}
	    
    },
	onChange:function(hsb,hex,rgb,el) {
	    var select=$('.selected');
	    for(var m=0;m<select.length;m++){
		var ss=$(select[m]).find('.backcolor')[0];
		$(ss).attr('style','background-color:#'+hex);
		
		updateWidget($(select[m]));
	}	//$('.now').removeClass('now');
		
	},
	
	
});
   
    $('#pen').colpick({
	

    submit:0,
    onShow:function(hsb,hex,rgb,el){
	    var select=$('.selected');
	    var color=$(select[0]).find('.fontsize').css("color");
	    console.log(color);
	    if(color!="rgba(0, 0, 0, 0)"){ 
	    $('#pen').colpickSetColor(rgb2hex(color));}
	    else{$('#pen').colpickSetColor('ffffff');}
	    $('#pen').colpickSetColor(rgb2hex(color));
	    
    },
	onChange:function(hsb,hex,rgb,el) {
	    var select=$('.selected');
	    for(var m=0;m<select.length;m++){
		var ss=$(select[m]).find('.fontsize')[0];
		var ar=$(ss).attr('style');
		console.log(ar);
		$(ss).attr('style',ar+';color:#'+hex);
		
		updateWidget($(select[m]));
	}	//$('.now').removeClass('now');
		
	},
	
	
});

    
    //$('#picker').colpick();

    //descriptions
    $("#addmyown").mouseover(function(){

        $("#addownex").show();
    }).mouseout(function() {
        $("#addownex").hide();
    });

    $("#iphone-w").mouseover(function(){

        $("#iphonex").show();
    }).mouseout(function() {
        $("#iphonex").hide();
    });
	
	$("#list-w").mouseover(function(){

        $("#listx").show();
    }).mouseout(function() {
        $("#listx").hide();
    });
    
    $("#checkbox-w").mouseover(function(){

        $("#checkboxx").show();
    }).mouseout(function() {
        $("#checkboxx").hide();
    });
	
	$("#droplist-w").mouseover(function(){

        $("#droplistx").show();
    }).mouseout(function() {
        $("#droplistx").hide();
    });
	
	$("#button-w").mouseover(function(){

        $("#buttonx").show();
    }).mouseout(function() {
        $("#buttonx").hide();
    });
	
	$("#inputbox-w").mouseover(function(){

        $("#inputboxx").show();
    }).mouseout(function() {
        $("#inputboxx").hide();
    });
	
	$("#arrow-w").mouseover(function(){

        $("#arrowx").show();
    }).mouseout(function() {
        $("#arrowx").hide();
    });
	
	$("#textlabel-w").mouseover(function(){

        $("#textlabelx").show();
    }).mouseout(function() {
        $("#textlabelx").hide();
    });
	
    //

    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    // END DJANGO AJAX


    $.fn.bringToTop = function() {
        this.css('z-index', ++highest); // increase highest by 1 and set the style
    };

     $.fn.bringToBottom = function() {
        this.css('z-index', --lowest); // increase highest by 1 and set the style
    };


    $('.nav').mouseenter(function(){
	    $('.task').css('opacity','1');
    });
    $('.nav').mouseleave(function(){
	    $('.task').css('opacity','0');
    });
    //Handle existing widgets
    $('.existing-widget').find('.text-oneline').dblclick(makeEditable);
	$('.existing-widget').find('.text-newline').dblclick(makeTextEditable);
    $('.existing-widget').find('.edit-list').dblclick(makeListEditable);
    $('.existing-widget #arrow').dblclick(function(event,ui){
        $(this).attr("src",images[x]);
        x++;
        if(x>7){
            x=0;
        }
    });

    var contents = $('.existing-widget').find('.widget-content');
    for (var i = 0; i < contents.length; i++){
        $(contents[i]).parent().css('z-index', $(contents[i]).attr('depth'));    
    }
    widgets = $('.existing-widget');
    //update depth
    for (var i = 0; i < widgets.length; i++){
        if ($(widgets[i]).css('z-index') && parseInt($(widgets[i]).css('z-index')) > highest){
            highest = parseInt($(widgets[i]).css('z-index'));
        }
    }

	for (var i = 0; i < widgets.length; i++){
        if ($(widgets[i]).css('z-index') && parseInt($(widgets[i]).css('z-index')) < lowest){
            lowest = parseInt($(widgets[i]).css('z-index'));
        }
    }
    //
    
    
    /*
       changef=$('.existing-widget').find('.text');
       for(var i=0;i<changef.length;i++){
       if($(changef[i]).hasClass('text')){

       $(changef[i]).parents('.draggable-widget').contextmenu({'Bringtofront':func1,
       'Change-Font':func3},
       'right');
       }
       }	
       add=$('.existing-widget').find('#addown');
       for(var j=0;j<add.length;j++){
       $(add[i]).parents('.draggable-widget').contextmenu({'Bringtofront':func1,
       'Crop':func3},
       'right');
       }
       */
	   
    //ctrl+z and ctrl+x undo-redo
	
	 $(window).bind('keydown', function(event) {
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
        case 'z':
            event.preventDefault();
            undo();
            break;
        case 'x':
            event.preventDefault();
            redo();
            break;
     
        }
      }
	  	if(event.altKey){
		    event.preventDefault();
            $('#canvas').imgAreaSelect({
           
            handles: true,
            onSelectEnd: function (img, selection) {
            recovercrop=0;
			
             x1=selection.x1;
             x2=selection.x2;
             y1=selection.y1;
             y2=selection.y2;
            console.log(x1,x2,y1,y2);
			 allwidget=$('#canvas').find('.draggable-widget');
			 console.log(allwidget);
			 for(var i=0;i<allwidget.length;i++){
			    var left=parseInt(allwidget[i].style.left);
				var top=parseInt(allwidget[i].style.top);
				var height=parseInt(allwidget[i].style.height);
				var width=parseInt(allwidget[i].style.width);
				if( left>x1&&top>y1&&(left+width)<x2&&(top+height)<y2){
				  $(allwidget[i]).addClass("selected");
				
				}
			 
			 
			 
			 }
			
			
			$('#canvas').imgAreaSelect({
              remove:true,
              handles:false});
	
               }
          });
			
	   }
    });
    

	
	crop=$('.existing-widget').find('.crop');
	for(var i=0;i<crop.length;i++){
	  $(crop[i]).contextmenu({ 
					  'crop':func2},
					  'right');
	}

    changefont=$('.existing-widget').find('.changefont');
	for(var i=0;i<changefont.length;i++){
    if($(changefont[i]).hasClass('changefont')){
    $(changefont[i]).parent().contextmenu({'Bringtofront':func1,
	                    'bringtoBottom':func8,
                        'Change-Font':func3,
						  },
                        'right');
     }  
    }
    
	iphone=$('.existing-widget').find('.iphone');
	for(var i=0;i<iphone.length;i++){
    if($(iphone[i]).hasClass('iphone')){
    $(iphone[i]).parent().contextmenu({'Bringtofront':func1,
	                    'bringtoBottom':func8
                        },
                        'right');
     }  
    }
	
    //rotate
	arrowcont=$('.existing-widget').find('.arrow');
				for(var i=0;i<arrowcont.length;i++){
				  $(arrowcont[i]).contextmenu({'Clockwise-Rotate':func5,
                        'Counterclockwise':func6},
                        'right');
				}
	
	
	
    $('.existing-widget').draggable({
        start: function(event, ui) {
            //get all selected...
            if (ui.helper.hasClass('selected')) selectedObjs = $('.selected');
            else {
                selectedObjs = $(ui.helper);
                $('.selected').removeClass('selected')
            }
        },
    drag: function(event, ui) {
        var currentLoc = $(this).position();
        var prevLoc = $(this).data('prevLoc');
        if (!prevLoc) {
            prevLoc = ui.originalPosition;
        }

        var offsetLeft = currentLoc.left-prevLoc.left;
        var offsetTop = currentLoc.top-prevLoc.top;

        moveSelected(offsetLeft, offsetTop);
        $(this).data('prevLoc', currentLoc);
        //updateWidget(this);
    },

    revert: function(event){
        if (!event){
            deleteWidget(this);
        }
        return false;
    },
    stop: function(event,ui){
       for(var k=0;k<selectedObjs.length;k++){
		updateWidget(selectedObjs[k]);
       }
    }
    });
    


    $('.existing-widget').resizable({
        resize:function(event,ui){
            if(event.ctrlKey){
                ctrlpress=1;
                updateWidget(this);
            }
        },
        stop: function(event, ui){
            /*
               var textheight=parseFloat($(this).css('height'));
               var textwidth=parseFloat($(this).css('width'));
               var textmin=Math.max(textheight,textwidth);
               var ratio=textmin/100;                    //original wideget is 100px*100px
               spantext=$(this).find("span");

               if(!spantext.hasClass("text")){
               if(!ctrlpress){
               var k='font-size:'+(40*ratio)+'px';
            //     spantext[0].setAttribute("style",k);
            //	  $(this).css({'font-size':(40*ratio)+"px"});
            }
            }
            ctrlpress=0;	    
            */
            updateWidget(this);
        }
    });

    //bring to front
    $('.existing-widget').dblclick(bringtofront);

    //select and focusout
    /*
       $('html').one('click',function(){
       $('widget').removeClass("selected");
       });
       */
    $('#canvas').click(function(event){
        $('.selected').removeClass("selected");
    });

  


    $(".existing-widget").click(function(event){
        event.stopPropagation();
        if(!event.ctrlKey){
            $('.selected').removeClass("selected");
        }

        $(this).addClass("selected");
    });
    //select and focusout ends
    document.onkeydown = checkdelete;


    // copy and paste
   
    if(browser=='Firefox'){
	    
	    $(document).keydown(function(e){
        if(e.ctrlKey&&(e.keyCode==67)){
        // alert("Ctrl+C was pressed!!");
		 widget = $(".selected");
		 console.log(widget);
        // alert('firefox');
            left=[];
            top=[];
            number=$('.selected').size();
       }
	   });
     
        $(document).keydown(function(e) {
        if(e.ctrlKey&&(e.keyCode==86)){
            var j=0;
			//alert('ddd')
 
            for(j=0;j<number;j++){
			   // alert('fff');
                var widgetnew=$(widget[j]).clone();
				//alert('aaa');
                $("#canvas").append(widgetnew);
                //$(widget[i]).addClass('existing-widget');
                $(widgetnew).click(function(event){
                    event.stopPropagation();
                    if(!event.ctrlKey){
                        $('.selected').removeClass("selected");
                    }
                    $(this).addClass("selected");
                });
                //    $(widget[i]).removeClass('draggable-widget');
                $(widgetnew).removeClass('ui-draggable');
                $(widgetnew).removeClass('ui-resizable');
                $(widgetnew).find('.ui-resizable-handle').remove();
                //contextmenu
                changefont=$(widgetnew).find('.changefont')
               for (var i=0;i<changefont.length;i++){
               
                    $(changefont[i]).parent().contextmenu({'Bringtofront':func1,
           'BringtoBottom':func8,
                        'Change-Font':func3,
              },
                        'right');
                } 
               
iphone=$(widgetnew).find('.iphone')
for (var i=0;i<iphone.length;i++){
               
                    $(iphone[i]).parent().contextmenu({'Bringtofront':func1,
    'BringtoBottom':func8},
                        'right');
                } 
                //arrow contextmenu
arrowcont=$(widgetnew).find('.widget-content');
for(var i=0;i<arrowcont.length;i++){
if($(arrowcont[i]).hasClass('arrow')){
  $(arrowcont[i]).contextmenu({'Clockwise-Rotate':func5,
                        'Counterclockwise':func6},
                        'right');
    }
}
crop=$(widgetnew).find('.crop');
      for(var i=0;i<crop.length;i++){
$(crop[i]).contextmenu({
                   
                        'crop':func2},
                      'right');
}
// contextmenu ends
                console.log($(widgetnew));
 
                if(!left[j]){
                    left[j]=$(widgetnew).position().left;
                    top[j]=$(widgetnew).position().top;
                    left[j]=left[j]-20;
                    top[j]=top[j]-20;
                }
                $(widgetnew).css('position', 'absolute');
                $(widgetnew).css('top', top[j]);
                $(widgetnew).css('left',left[j]);
                left[j]=left[j]-20;
                top[j]=top[j]-20;
 
                console.log($(widgetnew));
 
                $(widgetnew).find('.text-oneline').dblclick(makeEditable);
                $(widgetnew).find('.text-newline').dblclick(makeTextEditable);
                $(widgetnew).find('.edit-list').dblclick(makeListEditable);
              
                $(widgetnew).draggable({
                    start: function(event, ui) {
                        //get all selected...
                        if (ui.helper.hasClass('selected')) selectedObjs = $('.selected');
                        else {
                            selectedObjs = $(ui.helper);
                            $('.selected').removeClass('selected')
                        }
                    },
                    drag: function(event, ui) {
                        var currentLoc = $(this).position();
                        var prevLoc = $(this).data('prevLoc');
                        if (!prevLoc) {
                            prevLoc = ui.originalPosition;
                        }
 
                        var offsetLeft = currentLoc.left-prevLoc.left;
                        var offsetTop = currentLoc.top-prevLoc.top;
 
                        moveSelected(offsetLeft, offsetTop);
                        $(this).data('prevLoc', currentLoc);
                        //updateWidget(this);
                    },
                    revert: function(event){
                        if (!event){
                            deleteWidget(this);
                        }
                        return false;
                    },
              stop: function(event){
             for(var k=0;k<selectedObjs.length;k++){
                 updateWidget(selectedObjs[k]);
                       }
   
              }
                });
 
                $(widgetnew).resizable({
 
                    stop: function(event, ui){
 
                        updateWidget(this);
                    }
                });
 
                $(widgetnew).dblclick(bringtofront);
                createWidget(widgetnew);
                setDepthFront(widgetnew);
 
            }
 
 
            $('.selected').removeClass("selected"); 
 
        }
    });
   };
   
   if(browser=='Chrome'){
   
     $("html").bind({
        copy: function(){
 
            //alert('copy behaviour detected!');
            //console.log($(this));
            widget = $(".selected").clone();
 
            left=[];
            top=[];
            number=$('.selected').size();
			console.log(number);
			console.log(widget);
			
        },
        paste: function(){
            var j=0;
		//	alert('ddd')
 
            for(j=0;j<number;j++){
                var widgetnew=$(widget[j]).clone();
			//	alert('aaa');
                $("#canvas").append(widgetnew);
                //$(widget[i]).addClass('existing-widget');
                $(widgetnew).click(function(event){
                    event.stopPropagation();
                    if(!event.ctrlKey){
                        $('.selected').removeClass("selected");
                    }
                    $(this).addClass("selected");
                });
                //    $(widget[i]).removeClass('draggable-widget');
                $(widgetnew).removeClass('ui-draggable');
                $(widgetnew).removeClass('ui-resizable');
                $(widgetnew).find('.ui-resizable-handle').remove();
                //contextmenu
                changefont=$(widgetnew).find('.changefont')
               for (var i=0;i<changefont.length;i++){
               
                    $(changefont[i]).parent().contextmenu({'Bringtofront':func1,
           'BringtoBottom':func8,
                        'Change-Font':func3,
         },
                        'right');
                } 
               
iphone=$(widgetnew).find('.iphone')
for (var i=0;i<iphone.length;i++){
               
                    $(iphone[i]).parent().contextmenu({'Bringtofront':func1,
    'BringtoBottom':func8},
                        'right');
                } 
                //arrow contextmenu
arrowcont=$(widgetnew).find('.widget-content');
for(var i=0;i<arrowcont.length;i++){
if($(arrowcont[i]).hasClass('arrow')){
  $(arrowcont[i]).contextmenu({'Clockwise-Rotate':func5,
                        'Counterclockwise':func6},
                        'right');
    }
}
crop=$(widgetnew).find('.crop');
      for(var i=0;i<crop.length;i++){
$(crop[i]).contextmenu({
                   
                        'crop':func2},
                      'right');
}
// contextmenu ends
                console.log($(widgetnew));
 
                if(!left[j]){
                    left[j]=$(widgetnew).position().left;
                    top[j]=$(widgetnew).position().top;
                    left[j]=left[j]-20;
                    top[j]=top[j]-20;
                }
                $(widgetnew).css('position', 'absolute');
                $(widgetnew).css('top', top[j]);
                $(widgetnew).css('left',left[j]);
                left[j]=left[j]-20;
                top[j]=top[j]-20;
 
                console.log($(widgetnew));
 
                $(widgetnew).find('.text-oneline').dblclick(makeEditable);
                $(widgetnew).find('.text-newline').dblclick(makeTextEditable);
                $(widgetnew).find('.edit-list').dblclick(makeListEditable);
              
                $(widgetnew).draggable({
                    start: function(event, ui) {
                        //get all selected...
                        if (ui.helper.hasClass('selected')) selectedObjs = $('.selected');
                        else {
                            selectedObjs = $(ui.helper);
                            $('.selected').removeClass('selected')
                        }
                    },
                    drag: function(event, ui) {
                        var currentLoc = $(this).position();
                        var prevLoc = $(this).data('prevLoc');
                        if (!prevLoc) {
                            prevLoc = ui.originalPosition;
                        }
 
                        var offsetLeft = currentLoc.left-prevLoc.left;
                        var offsetTop = currentLoc.top-prevLoc.top;
 
                        moveSelected(offsetLeft, offsetTop);
                        $(this).data('prevLoc', currentLoc);
                        //updateWidget(this);
                    },
                    revert: function(event){
                        if (!event){
                            deleteWidget(this);
                        }
                        return false;
                    },
              stop: function(event){
             for(var k=0;k<selectedObjs.length;k++){
                 updateWidget(selectedObjs[k]);
                       }
   
              }
                });
 
                $(widgetnew).resizable({
 
                    stop: function(event, ui){
 
                        updateWidget(this);
                    }
                });
 
                $(widgetnew).dblclick(bringtofront);
                createWidget(widgetnew);
                setDepthFront(widgetnew);
 
            }
 
 
            $('.selected').removeClass("selected"); 
 
        },
    });
 
   };
    //copy and paste ends


    //add pictures	
    $(".existing-widget").dblclick(function(){
        var myown=$(this).find("#addown");
        if($(myown).length>0){
            var favorite = prompt('What is the URL of your picture?', 'http://');

            if (favorite) {
                console.log("Your link is: " +  favorite);
                myown.attr("src",favorite);
            }
            else console.log("You pressed Cancel or no value was entered!");
        }
        updateWidget(this);
    });
    //end add

    //Handle widget palette
    $(".draggable-widget:not(.existing-widget)").draggable({
        helper: "clone",
        revert: function(event){
            return !event; 
        }
    });

	


    // Make canvas droppable
    $("#canvas").droppable({
        activate: function(event, ui) {
            if (!($(ui.draggable).hasClass('existing-widget') || $(ui.draggable).hasClass('ui-dialog'))){
                //widget = $(ui.draggable).clone();
			   widget = $(ui.draggable).clone(); 
			   $(widget).bringToTop();
			   console.log($(widget).css('z-index'));
			   };
	    },
            
              
        
        drop: function(event, ui) {
            if (!($(ui.draggable).hasClass('existing-widget') || $(ui.draggable).hasClass('ui-dialog'))){
                //widget = $(ui.draggable).clone();
			   // widget = $(ui.draggable).clone();

                $(this).append(widget);
                $('#canvas .draggable-widget').addClass('existing-widget');
                //		myown=$(widget).find("#addown");
                //		if($(myown).length>0){
                //		$(myown).addClass("addmyown");
                //		}
                $(widget).css('position', 'absolute');
                $(widget).css('top', ui.position.top - $(this).position().top - 13);
                $(widget).css('left', ui.position.left - $(this).position().left - 13);
                what=$(widget).find("#iphone");
				whatarrow=$(widget).find('.widget-content');
                if(what.hasClass("iphone")){
                    $(widget).css('width', 160);
                    $(widget).css('height', 300);
                }
				else if(whatarrow.hasClass('arrow'))
				{
				    $(widget).css('width',150);
					$(widget).css('height',150);
				    $(widget).find('.widget-content').attr('rotate',0);
				}
				
				else if(whatarrow.hasClass('check'))
				{
				    $(widget).css('width',70);
					$(widget).css('height',80);
				   
				}
                else{	

                    $(widget).css('width', 150);
                    $(widget).css('height', 65);
                }

                $(widget).find('.text-oneline').dblclick(makeEditable);
				$(widget).find('.text-newline').dblclick(makeTextEditable);
                $(widget).find('.edit-list').dblclick(makeListEditable);
				
				//contextmenu
				changefont=$(widget).find('.changefont')
				for (var i=0;i<changefont.length;i++){
                
                    $(changefont[i]).parent().contextmenu({'Bringtofront':func1,
					    'BringtoBottom':func8,
                        'Change-Font':func3,
                        'help':fonthelp,
						},
                        'right');
                }  
                
				iphone=$(widget).find('.iphone')
				for (var i=0;i<iphone.length;i++){
                
                    $(iphone[i]).parent().contextmenu({'Bringtofront':func1,
					    'BringtoBottom':func8,
					    'help':iphonehelp,},
                        'right');
                }  
				
				
				
				
				
                //arrow contextmenu
				arrowcont=$(widget).find('.widget-content');
				for(var i=0;i<arrowcont.length;i++){
				if($(arrowcont[i]).hasClass('arrow')){
				  $(arrowcont[i]).contextmenu({'Clockwise-Rotate':func5,
                        'Counterclockwise':func6,
                        'help':arrowhelp,},
                        'right');
			    }
				}
				
				crop=$(widget).find('.crop');
			      for(var i=0;i<crop.length;i++){

			
				 $(crop[i]).contextmenu({ 
					                    
				                        'crop':func2,
				                        'help':crophelp,},
					                      'right');
				}
				
				// contextmenu ends
				
                $(widget).draggable({


                    start: function(event, ui) {
                        //get all selected...
                        if (ui.helper.hasClass('selected')) selectedObjs = $('.selected');
                        else {
                            selectedObjs = $(ui.helper);
                            $('.selected').removeClass('selected')
                        }
                    },
                    drag: function(event, ui) {
                        var currentLoc = $(this).position();
                        var prevLoc = $(this).data('prevLoc');
                        if (!prevLoc) {
                            prevLoc = ui.originalPosition;
                        }

                        var offsetLeft = currentLoc.left-prevLoc.left;
                        var offsetTop = currentLoc.top-prevLoc.top;

                        moveSelected(offsetLeft, offsetTop);
                        $(this).data('prevLoc', currentLoc);
                       // updateWidget(this);
					    
                    },

                    revert: function(event){
                        if (!event){
                            deleteWidget(this);
                        }
                        return false;
                    },
					stop: function(event,ui){
					    for(var k=0;k<selectedObjs.length;k++){
					       updateWidget(selectedObjs[k]);
					   }
                    }
                });
                $(widget).dblclick(bringtofront);

                $(widget).find("#arrow").dblclick(function(event,ui){
                    $(this).attr("src",images[x]);
                    x++;
                    if(x>7){
                        x=0;
                    }
                    updateWidget(this);
                });

                //add pictures	
                $(widget).dblclick(function(){
                    var myown=$(this).find("#addown");
                    if($(myown).length>0){
                        var favorite = prompt('What is the URL of your picture?', 'http://');

                        if (favorite) {
                            console.log("Your link is: " +  favorite);
                            myown.attr("src",favorite);
                        }
                        else console.log("You pressed Cancel or no value was entered!");
                    }
                    updateWidget(this);
                });
                //end add

                //select and focusout
                $(widget).click(function(event){
                    $('#canvas').one('click',function(){
                        $('.selected').removeClass("selected");
                    });
                    event.stopPropagation();
                    if(!event.ctrlKey){
                        $('.selected').removeClass("selected");
                    }

                    $(this).addClass("selected");
                });
                //select and focusout ends



                // change text for new text label
                $(widget).resizable({
                    resize:function(event,ui){
                        if(event.ctrlKey){
                            ctrlpress=1;
                        }
                        if(event.shirtKey){
                            $(widget).resizable(settings);
                        }
                        updateWidget(this);

                    },
                    stop: function(event, ui){
                        /*
                           var textheight=parseFloat($(this).css('height'));
                           var textwidth=parseFloat($(this).css('width'));
                           var textmin=Math.max(textheight,textwidth);
                           var ratio=textmin/100;                    //original wideget is 100px*100px
                           spantext=$(this).find("span");
                           if(!spantext.hasClass("text")){

                           if(!ctrlpress){
                           var k='font-size:'+(40*ratio)+'px';

                           spantext[0].setAttribute("style",k);
                           }
                           }
                           ctrlpress=0;
                           */
                        updateWidget(this);
                    }

                });

                createWidget(widget);
                $(widget).find('.widget-content').attr("depth", $(widget).css('z-index'));
            }
            else{
                widget = $(ui.draggable);
                updateWidget(widget);
            }
        }
    });
});

/* contextmenu - jQuery plugin
 * http://www.smartango.com/articles/jquery-context-menu
 * Copyright (c) 2010 Daniele Cruciani
 * Dual licensed under MIT and GPL licenses
 */

;(function($) {
    $.contextmenu='contextmenu';
    function removemenu(e){
        var el = e.target;
        if( $(el).parent('#'+$.contextmenu).size()==0) {
            $('#'+$.contextmenu).remove();
        }
        return false;
    }
    function firemenu(e,menu,el) {
        removemenu(e);
        $(el).data('clickphase',true);
        setTimeout(function(){$(el).removeData('clickphase');},300);
        $(el).addClass('selected');
        var m = $('<ul id="'+$.contextmenu+'">');
        $.each(menu, function(n,a) {
            if(typeof a == 'function') {
                m.append($("<li>").html(n).hover(
                        function(){
                            $(this).addClass("hover");
                        },
                        function(){
                            $(this).removeClass("hover");
                        })
                    .click(
                        function(evt){
                            $('#'+$.contextmenu).remove();
                            $(el).data('served',true);
                            a(evt,el);
                            $(el).removeData('served');
                        })
                    .mouseup(
                        function(evt){
                            if($(el).data('clickphase')) return true;
                            $('#'+$.contextmenu).remove();
                            $(el).data('served',true);
                            a(evt,el);
                            $(el).removeData('served');
                        })
                    );
            }
        });
        var pageX = e.pageX;
        var pageY = e.pageY;
        if(window.event) {
            pageX = $(window).scrollLeft()+e.clientX;
            pageY = $(window).scrollTop()+e.clientY;
        }
        m.css({'position':'absolute',top:pageY-3,left:pageX-3});
        $("body").append(m);
        document.getElementById($.contextmenu).oncontextmenu=function(){return false;};
        $("body").one('click',removemenu);
        $(document).one('mousedown',removemenu);
    }
    $.fn.contextmenu=function(menu,mode,timeout) {
        var els = this;
        $.each(els, function(i,el) {
            switch(mode) {
                case 'right':
                    el.oncontextmenu=function(e){if(e && !e.bubbles) {return true;} if(!e) e=window.event; if(!e.target) e.target = e.srcElement; firemenu(e,menu,el); if(window.event) window.event.cancelBubble = true; else e.stopPropagation();
                        return false;};
                    break;
                case 'hold':
                    var timeoutfun = null;
                    $(el).mousedown(function(e){
                        if(!e.bubbles) return;
                        if(e.button == 2) return ;
                        timeoutfun = setTimeout(function() {
                            $(el).data('menu',true);
                            firemenu(e,menu,el);
                            return false;
                        },timeout);
                    }).mouseup(function(e){
                        clearTimeout(timeoutfun);
                        if($(el).data('menu')) {
                        }
                    }).bind('dragstart',function(e){
                        clearTimeout(timeoutfun);
                        if($(el).data('menu')==true) return false;
                        return true;
                    });
                    break;
                case 'hover':
                    var timeoutfun = null;
                    $(el).mouseover(function(e){
                        if(!e.bubbles) return;
                        if($('#'+$.contextmenu).size()>0) return ;
                        if($(el).data('served')==true) return ;
                        timeoutfun = setTimeout(function() {
                            $(el).data('menu',true);
                            firemenu($(el).data('e'),menu,el);
                        },timeout);
                        return false;
                    }).mousemove(function(e){
                        $(el).data('e',e);
                    }).mouseout(function(e){
                        clearTimeout(timeoutfun);
                        $(el).removeData('e');
                    }).mousedown(function(e){
                        clearTimeout(timeoutfun);
                        $(el).removeData('e');
                    });
                    break;
            }
            return $(this);
        });
    }
})(jQuery);
