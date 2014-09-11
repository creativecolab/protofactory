from django.db import models
import json
#!/usr/bin/env python
# -*- coding: utf-8 -*- 


# Create your models here.
class Interface(models.Model):
    name = models.CharField(max_length=200)

class User(models.Model):
	
	interface_id = models.CharField(max_length=200)
	mturk_id = models.CharField(max_length=200)
	survey_code=models.CharField(max_length=200)
	task = models.CharField(max_length=200)
	timespent = models.CharField(max_length=200)
	user_name = models.CharField(max_length=200)
	os = models.CharField(max_length=200)
	browser = models.CharField(max_length=200)
	age = models.CharField(max_length=200)
	gender = models.CharField(max_length=200)
	country = models.CharField(max_length=200)
	language = models.CharField(max_length=200)
	degree = models.CharField(max_length=200)
	major = models.CharField(max_length=200)
	evaluation = models.CharField(max_length=200)
	experience = models.CharField(max_length=200)
    

class Widget(models.Model):
    interface = models.ForeignKey(Interface)
    value = models.CharField(max_length=200)
    top = models.CharField(max_length=200)
    left = models.CharField(max_length=200)
    width = models.CharField(max_length=200)
    height = models.CharField(max_length=200)
    active = models.BooleanField(default=True)

    def getJSON(self):
        return json.dumps(self.getDict())

    def getDict(self):
        vals = {}
        vals['pk'] = self.pk
        vals['value'] = self.value
        vals['top'] = self.top
        vals['left'] = self.left
        vals['width'] = self.width
        vals['height'] = self.height
        vals['active'] = self.active
        return vals

class Log(models.Model):
    interface = models.ForeignKey(Interface)
    widget = models.ForeignKey(Widget)
    action = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    top = models.CharField(max_length=200)
    left = models.CharField(max_length=200)
    width = models.CharField(max_length=200)
    height = models.CharField(max_length=200)
    created = models.CharField(max_length=200)

class Undo(models.Model):
    interface = models.ForeignKey(Interface)
    widget = models.ForeignKey(Widget)
    action = models.CharField(max_length=200)
    is_redo = models.BooleanField(default=False)
    prev_value = models.CharField(max_length=200)
    prev_top = models.CharField(max_length=200)
    prev_left = models.CharField(max_length=200)
    prev_width = models.CharField(max_length=200)
    prev_height = models.CharField(max_length=200)
    next_value = models.CharField(max_length=200)
    next_top = models.CharField(max_length=200)
    next_left = models.CharField(max_length=200)
    next_width = models.CharField(max_length=200)
    next_height = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)

