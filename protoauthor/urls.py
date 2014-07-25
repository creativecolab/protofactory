from django.conf.urls import patterns, url

from protoauthor import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^createInterface/$', views.createInterface, name='createInterface'),
    url(r'^updateInterface/([0-9]+)/$', views.updateInterface, name='updateInterface'),
    url(r'^viewInterface/([0-9]+)/$', views.viewInterface, name='viewInterface'),
    url(r'^deleteInterface/([0-9]+)/$', views.deleteInterface, name='deleteInterface'),
    url(r'^createWidget/$', views.createWidget, name='createWidget'),
    url(r'^updateWidget/$', views.updateWidget, name='updateWidget'),
    url(r'^deleteWidget/$', views.deleteWidget, name='deleteWidget'),
)
