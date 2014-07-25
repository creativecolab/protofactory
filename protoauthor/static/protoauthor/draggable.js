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

function createWidget(widget){
    // add widget and save position
    var href = $(location).attr("href");
    var vals = href.split('/');
    prefix = "/";
    if (vals[3] == vals[vals.length-4]){
        prefix = prefix + vals[3] + "/";
    }
    console.log(prefix);
    interface_id = vals[vals.length - 2];
    $.ajax({
        type: "POST",
        url: prefix + "createWidget/", 
        data: { 
            interface_id: interface_id, 
            value: $(widget).find(".widget")[0].outerHTML, 
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
    var href = $(location).attr("href");
    var vals = href.split('/');
    prefix = "/";
    if (vals[3] == vals[vals.length-4]){
        prefix = prefix + vals[3] + "/";
    }
    $.ajax({
        type: "POST",
        url: prefix + "updateWidget/", 
        data: { 
            widget_id: $(widget).attr('widget-id'), 
            value: $(widget).find(".widget")[0].outerHTML, 
            top: $(widget).css('top'), 
            left: $(widget).css('left'),
            width: $(widget).css('width'),
            height: $(widget).css('height'),},
        success: function(data){
            console.log(data);
        },
    });
}

function deleteWidget(widget){
    var href = $(location).attr("href");
    var vals = href.split('/');
    prefix = "/";
    if (vals[3] == vals[vals.length-4]){
        prefix = prefix + vals[3] + "/";
    }
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
    editableText = $("<input />");
    text = $(this).text();
    editableText.val(text);
	var a=0;
	if($(this).hasClass("text"))   //whether is a textlabel OR textbutton
	{ a=1;}
    var originfont=$(this).css('font-size');
    $(this).replaceWith(editableText);
    $(editableText).focus();
    $(editableText).change(function(){
        $(this).blur();
    });
    $(editableText).focusout(function(event, ui){

        text = $(this).val();
        uneditableText = $("<span/>");
		if(a==1){
	//	uneditableText.css("position","relative");
	//	uneditableText.css("top","37%");
	//	uneditableText.css("left","32%");
		//var s='font-size:20px;position:relative;top:37%;left:32%;';
	  //  uneditableText[0].setAttribute('style',s);
		uneditableText.addClass("text");
		}
		
		
        uneditableText.text(text);
		$(this).replaceWith(uneditableText);
        
        widget = $(uneditableText).parent();
		widget_1 = $(widget).parent();
        $(uneditableText).dblclick(makeEditable);

        updateWidget(widget_1);
    });
}
//edit for text label ends 

function changeImage(event,ui)
{

var images=new Array(' http://pb-i4.s3.amazonaws.com/photos/365451-1405284777-3.jpg ',' http://pb-i4.s3.amazonaws.com/photos/365451-1405284877-1.jpg ')
//	images[0] = "http://pb-i4.s3.amazonaws.com/photos/365451-1405284777-3.jpg";
//	images[1] = "http://pb-i4.s3.amazonaws.com/photos/365451-1405284877-1.jpg";
document.getElementById("picture").src=images[x];
x++;
if(x==1) x=0;

}

function bringtofront(event,ui){
 $(this).bringToTop();
}







$(function () {

    // BEGIN DJANGO AJAX
    // Call the functions for the DJANGO, so you can do AJAX
    var csrftoken = getCookie('csrftoken');
	var ctrlpress=0;
	var value=0;
	var test = 5;
	var highest = 1;
	var settings={
	    aspectRatio:1
	};
	var x=1;
	var selectone;
	var addmy=$(".existing-widget").find("#addown");
    //define the arrow picture
	var images=new Array()
	images[0] = "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-0.jpg";
	images[1] = "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-1.jpg";
	images[2]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-2.jpg";
	images[3]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-3.jpg";
	images[4]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690846-4.jpg";
	images[5]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690882-0.jpg";
	images[6]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690882-1.jpg";
	images[7]=  "http://pb-i4.s3.amazonaws.com/photos/365451-1405690882-2.jpg";
	//end define arrows

	
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
    $('.existing-widget').find('span').dblclick(makeEditable);
	$('.existing-widget #arrow').dblclick(function(event,ui){
    $(this).attr("src",images[x]);
    x++;
    if(x>7){
	x=0;
	}
  });
  
    $('.existing-widget').draggable({
      revert: function(event){
            if (!event){
                deleteWidget(this);
            }
            return false;
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
	$('html').click(function(event){
		$('.widget').removeClass("selected");
	});
	$(".existing-widget").click(function(event){
	  event.stopPropagation();
      $(this).addClass("selected");
	});
	 //select and focusout ends
	
    // copy and paste
	$("html").bind({
		copy: function(){
			
			alert('copy behaviour detected!');
			//console.log($(this));
			widget = $(".selected").clone();
			number=$('.selected').size();
		},
		paste: function(){
			alert('paste detect');
			var i=0;
			for(i=0;i<number;i++){
			 $("#droppable").append(widget[i]);
            //$(widget[i]).addClass('existing-widget');
			$(widget[i]).click(function(event){
				event.stopPropagation();
				$(this).addClass("selected");
			});
			
			
			$(widget[i]).removeClass('draggable-widget');
			$(widget[i]).removeClass('ui-draggable');
			$(widget[i]).removeClass('ui-resizable');
			$(widget[i]).find('.ui-resizable-handle').remove();
	            console.log($(widget[i]));
                $(widget[i]).css('position', 'absolute');
                $(widget[i]).css('top',$(widget[i]).position().top - 20-i*3);
                $(widget[i]).css('left',$(widget[i]).position().left - 20-i*3);
                //$(widget[i]).css('width', $(widget[i]).width());
                //$(widget[i]).css('height', 75);
                
                $(widget[i]).find('span').dblclick(makeEditable);
				
                $(widget[i]).draggable({
                    revert: function(event){
                        if (!event){
                            deleteWidget(this);
                        }
                        return false;
                    }
                });
				
				$(widget[i]).resizable({
				    
                       stop: function(event, ui){
					    
                        updateWidget(this);
                    }
				 });
				
				$(widget[i]).dblclick(bringtofront);
				createWidget(widget[i]);
				}
				
			
			$('.existing-widget').removeClass("selected");  
			
		},
	});

	//copy and paste ends

 
    //add pictures	
	$(".existing-widget").dblclick(function(){
	var myown=$(this).find("#addown");
	if($(myown).length>0){
	var favorite = prompt('What is the URL of your picture?', 'http://');
    
     if (favorite) {
	 alert("Your link is: " +  favorite);
	 myown.attr("src",favorite);
	 }
     else alert("You pressed Cancel or no value was entered!");
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
    $("#droppable").droppable({
        drop: function(event, ui) {
            if (!$(ui.draggable).hasClass('existing-widget')){
                widget = $(ui.draggable).clone();
                $(this).append(widget);
                $('#droppable .draggable-widget').addClass('existing-widget');
		//		myown=$(widget).find("#addown");
		//		if($(myown).length>0){
		//		$(myown).addClass("addmyown");
		//		}
                $(widget).css('position', 'absolute');
                $(widget).css('top', ui.position.top - $(this).position().top - 13);
                $(widget).css('left', ui.position.left - $(this).position().left - 13);
                $(widget).css('width', 150);
                $(widget).css('height', 75);
               
                $(widget).find('span').dblclick(makeEditable);
				
                $(widget).draggable({
				     grid: [ 25, 25 ] ,
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
	            alert("Your link is: " +  favorite);
	            myown.attr("src",favorite);
	               }
               else alert("You pressed Cancel or no value was entered!");
	            }
				updateWidget(this);
                  });
               //end add
			   
		       //select and focusout
	           $(widget).click(function(event){
	           $('html').one('click',function(){
	           $('.existing-widget').removeClass("selected");
	             });
	            event.stopPropagation();
               $(this).addClass("selected");
	           });
	          //select and focusout ends
	 
             // copy and paste
			 /*
	         $(widget).bind({
		      copy: function(){
			        alert('copy behaviour detected!');
			        //console.log($(this));
			        widget = $(".selected").clone();
			        number=$('.selected').size();
		       },
		      paste: function(){
			        alert('paste detect');
			        var i=0;
			        for(i=0;i<number;i++){
			        $("#droppable").append(widget[i]);
                    $('#droppable .draggable-widget').addClass('existing-widget');
                    $(widget[i]).css('position', 'absolute');
                    $(widget[i]).css('top',$('.selected').position().top - 20-i*3);
                    $(widget[i]).css('left',$('.selected').position().left - 20-i*3);
                    $(widget[i]).css('width', 150);
                    $(widget[i]).css('height', 75);
               
                    $(widget[i]).find('span').dblclick(makeEditable);
				
                    $(widget[i]).draggable({
                       revert: function(event){
                        if (!event){
                            deleteWidget(this);
                        }
                        return false;
                        }
                    });
				
				    $(widget[i]).resizable({
					  
				      resize:function(event,ui){
					       if(event.ctrlKey){
						    ctrlpress=1;
			               }
						   if(event.shirtKey){
						   $(widget[i]).resizable(settings);
						   }
						   updateWidget(this);
				
				        },
                       stop: function(event, ui){
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
                        updateWidget(this);
                    }
					
                 });

				$(widget[i]).dblclick(bringtofront);
				 createWidget(widget[i]);
				}
				$('.existing-widget').removeClass("selected"); 
		        },
	       });
			*/
	       //copy and paste ends

				
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
                        updateWidget(this);
                    }
					
                });

                createWidget(widget);
            }
            else{
                widget = $(ui.draggable);
                updateWidget(widget);
            }
        }
    });
});
