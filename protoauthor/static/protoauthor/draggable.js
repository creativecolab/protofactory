var highest = 1;

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
        },
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
    return  vals[vals.length - 2];
}

function get_site_prefix(){
    var href = $(location).attr("href");
    var vals = href.split('/');
    var prefix = "/";
    if (vals[3] == vals[vals.length-4]){
        prefix = prefix + vals[3] + "/";
    }
    return prefix
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
    $(widget).remove();
}

function makeEditable(event){
    editableText = $("<textarea />");
    $(editableText).css("width","100%");
    $(editableText).css("height","100%");
    editableText.val($(this).text());

    $(this).replaceWith(editableText);
    $(editableText).focus();
    $(editableText).change(function(){
        $(this).blur();
    });
    $(editableText).focusout(function(event, ui){
        var uneditableText = $("<div/>");
        uneditableText.addClass("text");
        uneditableText.text($(this).val());
        $(this).replaceWith(uneditableText);

        widget = $(uneditableText).parent();
        while (!widget.attr('widget-id')){
            widget = widget.parent();
        }
        $(uneditableText).dblclick(makeEditable);
        updateWidget(widget);
    });
}

function makeListEditable(event){
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
    $(editableText).focus();
    $(editableText).change(function(){
        $(this).blur();
    });
    $(editableText).focusout(function(event, ui){
        var uneditableText = $("<ul/>");
        uneditableText.addClass("edit-list");
        var lines = $(this).val().split('\n');
        for (var i = 0; i < lines.length; i++){
            var element = $("<li/>");
            element.text(lines[i]);
            uneditableText.append(element);
        }
        $(this).replaceWith(uneditableText);
        widget = $(uneditableText).parent();
        while (!widget.attr('widget-id')){
            widget = widget.parent();
        }
        $(uneditableText).dblclick(makeListEditable);
        updateWidget(widget);
    });
}



function setDepthFront(widget){
    $(widget).bringToTop();
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

/*function func2(e,e2){
  var a=0;
  $(e2).imgAreaSelect({
  handles: true,
  onSelectEnd: function (img, selection) {
  $('.imgareaselect-selection').css("opacity","0");
  $('.imgareaselect-outer').css("opacity",'1');

  }   
  }); 
  $(e2).draggable( "disable" );

  var e = window.event || e;
  var code = e.which || e.keyCode;
  if(code == 13) {
  alert('ddd');
  var back=$(e2).find("#addown");
  back[0].setAttribute("style","width:40px;height:50px;margin-Left:-10px;margin-Right:-10px;");
  }

  }
  */

function func3(e,e3){
    var textchange=$(e3).find(".text");
    var fontsize = prompt('input the font-size (px) :', '15');

    if (fontsize) {
        console.log("Your fontsize is: " +  fontsize);
        textchange.attr("style","font-size:"+fontsize+'px');
    }
    else {console.log("You pressed Cancel or no value was entered!");
    }
    updateWidget($(e3));
}


function checkdelete(e,ui)
{
    var e = window.event || e;
    var code = e.which || e.keyCode;
    deletewidget=$(".selected");
    if(code == 46)
    {

        var number=$(".selected").size();
        for(var i=0;i<number;i++){
            deleteWidget(deletewidget[i]);
        }
    }
}

/*function checkenter(e,ui)
  {
  var e = window.event || e;
  var code = e.which || e.keyCode;
  if(code == 13)
  {
  var number=$(".selected").size();
  for(var i=0;i<number;i++){
  deleteWidget(deletewidget[i]);
  }
  }
  }
  */

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
    //define the arrow picture
    var images=new Array();
    images[0] = "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-0.jpg";
    images[1] = "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-1.jpg";
    images[2]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-2.jpg";
    images[3]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-3.jpg";
    images[4]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-4.jpg";
    images[5]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690882-0.jpg";
    images[6]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690882-1.jpg";
    images[7]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690882-2.jpg";
    //end define arrows





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



    //Handle existing widgets
    $('.existing-widget').find('.text').dblclick(makeEditable);
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

    //contextmenu
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






    //rotate
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
        //$.each(selectedObjs, function(w){
        //    updateWidget(w);
        //});
        updateWidget(this);
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
    $("html").bind({
        copy: function(){

            //alert('copy behaviour detected!');
            //console.log($(this));
            widget = $(".selected").clone();

            left=[];
            top=[];
            number=$('.selected').size();
        },
        paste: function(){
            var i=0;

            for(i=0;i<number;i++){
                var widgetnew=$(widget[i]).clone();
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
                console.log($(widgetnew));

                if(!left[i]){
                    left[i]=$(widgetnew).position().left;
                    top[i]=$(widgetnew).position().top;
                    left[i]=left[i]-20;
                    top[i]=top[i]-20;
                }
                $(widgetnew).css('position', 'absolute');
                $(widgetnew).css('top', top[i]);
                $(widgetnew).css('left',left[i]);
                left[i]=left[i]-20;
                top[i]=top[i]-20;

                console.log($(widgetnew));

                $(widgetnew).find('.text').dblclick(makeEditable);
                $(widgetnew).find('.edit-list').dblclick(makeListEditable);
                $(widgetnew).contextmenu({'bring to front':func1,
                },
                'right');
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
                        updateWidget(this);
                    },
                    revert: function(event){
                        if (!event){
                            deleteWidget(this);
                        }
                        return false;
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
        drop: function(event, ui) {
            if (!$(ui.draggable).hasClass('existing-widget')){
                widget = $(ui.draggable).clone();
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
                if(what.hasClass("iphone")){
                    $(widget).css('width', 160);
                    $(widget).css('height', 300);
                }
                else{	

                    $(widget).css('width', 150);
                    $(widget).css('height', 65);
                }

                $(widget).find('.text').dblclick(makeEditable);
                $(widget).find('.edit-list').dblclick(makeListEditable);
                if($(widget).hasClass('changefont')){
                    $(widget).contextmenu({'Bringtofront':func1,
                        'Change-Font':func3},
                        'right');
                }  
                add=$(widget).find('#addown');
                if(add.hasClass('crop')){

                    $(widget).contextmenu({'Bringtofront':func1,
                        'Crop':func3},
                        'right');

                }				

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
                        updateWidget(this);
                    },

                    revert: function(event){
                        if (!event){
                            deleteWidget(this);
                        }
                        return false;
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
                setDepthFront(widget);
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
