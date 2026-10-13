from django.urls import path

from . import views




app_name = 'analyser'

urlpatterns = [
	path('', views.home, name = 'home'),
	path('analyse', views.analyse, name = 'analyse'),
	path('batch/', views.batch, name = 'batch'),
]
