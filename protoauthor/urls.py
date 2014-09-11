from django.conf.urls import patterns, url
from protoauthor import views

urlpatterns = patterns('',
    url(r'^index/$', views.index, name='index'),
    url(r'^newDesign/$', views.newDesign, name='newDesign'),
    url(r'^createInterface/$', views.createInterface, name='createInterface'),
    url(r'^gettime/$',views.gettime,name='gettime'),
    url(r'^survey/([0-9]+)/$',views.survey,name="survey"),
    url(r'^updateInterface/([0-9]+)/([0-9]+)/$', views.updateInterface, name='updateInterface'),
    url(r'^viewInterface/([0-9]+)/$', views.viewInterface, name='viewInterface'),
    url(r'^deleteInterface/([0-9]+)/$', views.deleteInterface, name='deleteInterface'),
    url(r'^help/$',views.help,name='help'),
    url(r'^taska/$',views.taska,name='taska'),
    url(r'^taskb/$',views.taskb,name='taskb'),
    url(r'^taskc/$',views.taskc,name='taskc'),
    url(r'^log/$',views.log,name='log'),
    url(r'^getsurvey/$',views.getsurvey,name='getsurvey'),
    url(r'^user_database/$',views.user_database,name='user_database'),
    url(r'^createWidget/$', views.createWidget, name='createWidget'),
    url(r'^updateWidget/$', views.updateWidget, name='updateWidget'),
    url(r'^deleteWidget/$', views.deleteWidget, name='deleteWidget'),
    url(r'^undoRedo/$', views.undoRedo, name='undoRedo'),
)
 