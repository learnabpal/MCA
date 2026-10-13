import uuid

from django.conf import settings
from django.db import models




class Workspace(models.Model) :
	id = models.UUIDField(primary_key = True, default = uuid.uuid4, editable = False)
	owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name = "workspace")
	name = models.CharField(max_length = 120)
	slug = models.SlugField(max_length = 140, unique = True)
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)
	
	
	class Meta :
		ordering = [ "name" ]
	
	
	def __str__( self ) :
		return self.name
