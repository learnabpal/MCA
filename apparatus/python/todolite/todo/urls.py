from django.urls import path
from . import views




app_name = 'todo'

urlpatterns = [
	path('', views.index, name = 'index'),
	path('create/', views.create, name = 'create'),
	path('delete/<int:todo_id>', views.delete, name = 'delete'),
	path('update/<int:todo_id>', views.update, name = 'update'),
	path('detail/<int:todo_id>', views.detail, name = 'detail'),
]
