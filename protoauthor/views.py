from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse
from django.template.defaulttags import csrf_token
# Create your views here.

from protoauthor.models import Interface
from protoauthor.models import Widget

def index(request):
    interfaces = Interface.objects.all()
    context = {'interfaces': interfaces}
    return render(request, 'protoauthor/index.html', context)

def createInterface(request):
    if request.method == 'POST' and request.POST['name'] != "":
        interface = Interface(name=request.POST['name'])
        interface.save()
    return redirect('protoauthor.views.index')

def updateInterface(request, interface_id):
    interface = get_object_or_404(Interface, pk=interface_id)
    widgets = interface.widget_set.all()
    return render(request, 'protoauthor/updateInterface.html', {'interface':
                                                                interface,
                                                                'widgets':
                                                                widgets})

def deleteInterface(request, interface_id):
    interface = Interface.objects.get(pk=interface_id)
    interface.delete()
    return redirect('protoauthor.views.index')

def viewInterface(request, interface_id):
    interface = get_object_or_404(Interface, pk=interface_id)
    widgets = interface.widget_set.all()
    return render(request, 'protoauthor/viewInterface.html', {'interface':
                                                                interface,
                                                                'widgets':
                                                                widgets})

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
    return HttpResponse(widget.getJSON(), content_type='application/json')

def updateWidget(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    widget = Widget.objects.get(pk=post['widget_id'])
    widget.value = post['value']
    widget.top = post['top']
    widget.left = post['left']
    widget.width = post['width']
    widget.height = post['height']

    print(widget.width)
    print(widget.height)
    widget.save()
    return HttpResponse(widget.getJSON(), content_type='application/json')

def deleteWidget(request):
    if request.method != 'POST' and request.POST:
        return HttpResponse("ERROR")
    post = request.POST.dict()
    widget = Widget.objects.get(pk=post['widget_id'])
    widget.delete()
    return HttpResponse('OK')
