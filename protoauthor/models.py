from django.db import models
import json

# Create your models here.
class Interface(models.Model):
    name = models.CharField(max_length=200)

class Widget(models.Model):
    interface = models.ForeignKey(Interface)
    value = models.CharField(max_length=200)
    top = models.CharField(max_length=200)
    left = models.CharField(max_length=200)
    width = models.CharField(max_length=200)
    height = models.CharField(max_length=200)
	

    def getJSON(self):
        vals = {}
        vals['pk'] = self.pk
        vals['value'] = self.value
        vals['top'] = self.top
        vals['left'] = self.left
        vals['width'] = self.width
        vals['height'] = self.height
        return json.dumps(vals)



