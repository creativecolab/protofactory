from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.template.defaulttags import csrf_token
import json
# Create your views here.

from protoauthor.models import Interface
from protoauthor.models import Widget
from protoauthor.models import Log
from protoauthor.models import Undo
from protoauthor.models import User

def index(request):
    interfaces = Interface.objects.all()
    context = {'interfaces': interfaces}
    return render(request, 'protoauthor/index.html', context)
	

def newDesign(request):
    name = "AutoGen"
    interface = Interface(name=name)
    interface.save()
    turk_id ="1"
    user = User(interface_id=interface.id, task="0", timespent="null",os="null",browser="null",age="null",gender="null",country="null",evaluation="null",experience="null")
    user.save()
    
    return redirect('protoauthor.views.updateInterface', interface.id,user.id)
    

def help(request):
	return render(request,'protoauthor/help.html')


def taska (request):
	return render(request,'protoauthor/taska.html')


def taskb(request):
	return render(request,'protoauthor/taskb.html')

def taskc(request):
	return render(request,'protoauthor/taskc.html')
		
def survey(request,user_id):
	user=get_object_or_404(User,pk=user_id)
	return render(request,'protoauthor/survey.html',{'user':user,})


def createInterface(request):
    if request.method == 'POST' and request.POST['name'] != "":
        interface = Interface(name=request.POST['name'])
        interface.save()
    return redirect('protoauthor.views.index')

def updateInterface(request, interface_id,user_id):
    interface = get_object_or_404(Interface, pk=interface_id)
    user = get_object_or_404(User, pk=user_id)
    widgets = interface.widget_set.filter(active=True)
    return render(request, 'protoauthor/updateInterface.html', {'interface':
                                                                interface,
                                                                'widgets':
                                                                widgets,'user':user,})

def deleteInterface(request, interface_id):
    interface = Interface.objects.get(pk=interface_id)
    interface.delete()
    return redirect('protoauthor.views.index')

def viewInterface(request, interface_id):
    interface = get_object_or_404(Interface, pk=interface_id)
    widgets = interface.widget_set.filter(active=True)
    return render(request, 'protoauthor/viewInterface.html', {'interface':
                                                                interface,
                                                                'widgets':
                                                                widgets})
def user_database(request):
    
    user=User.objects.all().exclude(task="0");
    return render(request,'protoauthor/user_database.html',{'user':user})                                                                
                                                                
def getsurvey(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    user = User.objects.get(pk=post['user_id'])
    user.age=post['age']
    user.country=post['country']
    user.experience=post['experience']
    user.gender=post['gender']
    user.os=post['os']
    user.browser=post['browser']
 
 
    user.evaluation=post['evaluation']
    user.save()
    return HttpResponse('Update user')

def gettime(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    user = User.objects.get(pk=post['user_id'])
    user.timespent = post['timespent']
    user.task = post['task']
    user.save()
    return HttpResponse('Update timer')                                                                                                                                



def createWidget(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    interface = Interface.objects.get(pk=post['interface_id'])
    widget = Widget(interface=interface,
                    value=post['value'],
                    top=post['top'],
                    left=post['left'],
                    width=post['width'],
                    height=post['height'])
    #widget = Widget(interface=interface, value=value, top=top, left=left)
    widget.save()

    log = Log(interface=interface,
              widget=widget,
              action="create",
              value= widget.value,
              top = widget.top,
              left = widget.left,
              width = widget.width,
              height = widget.height)
    log.save()

    undo = Undo(interface = widget.interface,
              widget = widget,
              action = "create",
              prev_value = "",
              prev_top = "",
              prev_left = "", 
              prev_width = "",
              prev_height = "",
              next_value= widget.value,
              next_top = widget.top,
              next_left = widget.left,
              next_width = widget.width,
              next_height = widget.height)
    undo.save()

    Undo.objects.filter(interface=widget.interface, is_redo=True).delete()

    return HttpResponse(widget.getJSON(), content_type='application/json')

def updateWidget(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    widget = Widget.objects.get(pk=post['widget_id'])

    old_value = widget.value
    old_top = widget.top
    old_left = widget.left
    old_width = widget.width
    old_height = widget.height

    widget.value = post['value']
    widget.top = post['top']
    widget.left = post['left']
    widget.width = post['width']
    widget.height = post['height']

    widget.save()

    log = Log(interface=widget.interface,
              widget=widget,
              action="update",
              value= widget.value,
              top = widget.top,
              left = widget.left,
              width = widget.width,
              height = widget.height)
    log.save()

    undo = Undo(interface = widget.interface,
              widget = widget,
              action = "update",
              prev_value = old_value,
              prev_top = old_top,
              prev_left = old_left, 
              prev_width = old_width,
              prev_height = old_height,
              next_value= widget.value,
              next_top = widget.top,
              next_left = widget.left,
              next_width = widget.width,
              next_height = widget.height)
    undo.save()

    Undo.objects.filter(interface=widget.interface, is_redo=True).delete()

    return HttpResponse(widget.getJSON(), content_type='application/json')

def undoRedo(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    interface = Interface.objects.get(pk=post['interface_id'])
    is_redo = post['is_redo'] == "True"

    if Undo.objects.filter(interface=interface, is_redo=is_redo).count() == 0:
        return HttpResponse('None')

    last_undo_redo = Undo.objects.filter(interface=interface, is_redo=is_redo).order_by('-created')[0]

    if last_undo_redo.action == "update":
        action = "update"
    elif last_undo_redo.action == "delete":
        action = "create"
    else:
        action = "delete"

    new_undo_redo = Undo(interface = last_undo_redo.interface,
              widget = last_undo_redo.widget,
              action = action,
              is_redo = not is_redo,
              prev_value = last_undo_redo.next_value,
              prev_top = last_undo_redo.next_top,
              prev_left = last_undo_redo.next_left, 
              prev_width = last_undo_redo.next_width,
              prev_height = last_undo_redo.next_height,
              next_value= last_undo_redo.prev_value,
              next_top = last_undo_redo.prev_top,
              next_left = last_undo_redo.prev_left,
              next_width = last_undo_redo.prev_width,
              next_height = last_undo_redo.prev_height)
    new_undo_redo.save()

    widget = last_undo_redo.widget

    action_type = {True: "Redo", False: "Undo"}

    if action == "update":
        widget.value = last_undo_redo.prev_value
        widget.left = last_undo_redo.prev_left
        widget.top = last_undo_redo.prev_top
        widget.width = last_undo_redo.prev_width
        widget.height = last_undo_redo.prev_height
        log = Log(interface=widget.interface,
                  widget=widget,
                  action= action_type[is_redo] + "_" + action,
                  value= widget.value,
                  top = widget.top,
                  left = widget.left,
                  width = widget.width,
                  height = widget.height)
        log.save()
    elif action == "create":
        widget.active = True
        log = Log(interface=widget.interface,
                  widget=widget,
                  action= action_type[is_redo] + "_" + action,
                  value= widget.value,
                  top = widget.top,
                  left = widget.left,
                  width = widget.width,
                  height = widget.height)
        log.save()
    else:
        widget.active = False
        log = Log(interface=widget.interface,
                  widget=widget,
                  action= action_type[is_redo] + "_" + action,
                  value= "",
                  top = "",
                  left = "",
                  width = "",
                  height = "")
        log.save()
    widget.save()
    last_undo_redo.delete()

    response = {'action': action, 'widget': widget.getDict()}
    return HttpResponse(json.dumps(response), content_type='application/json')

def deleteWidget(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    widget = Widget.objects.get(pk=post['widget_id'])
    widget.active = False
    widget.save()
    #widget.delete()

    log = Log(interface=widget.interface,
              widget=widget,
              action="delete",
              value= "" ,
              top = "",
              left = "",
              width = "",
              height = "")
    log.save()

    undo = Undo(interface = widget.interface,
              widget = widget,
              action = "delete",
              prev_value = widget.value,
              prev_top = widget.top,
              prev_left = widget.left, 
              prev_width = widget.width,
              prev_height = widget.height,
              next_value= "",
              next_top = "",
              next_left = "",
              next_width = "",
              next_height = "")
    undo.save()

    Undo.objects.filter(interface=widget.interface, is_redo=True).delete()

    return HttpResponse('OK')

