from django.urls import path

from . import views


app_name = 'analyser'

urlpatterns = [
	path('', views.home, name = 'home'),
	path('upload/', views.upload, name = 'upload'),
]
