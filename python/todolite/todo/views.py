from django.shortcuts import get_object_or_404, redirect, render

from .models import Todo




def index( request ) :
	todos = Todo.objects.order_by('-created_at')
	return render(request, 'todo/index.html', { 'todos' : todos })


def create( request ) :
	if request.method == 'POST' :
		todo = Todo.objects.create(
			title = request.POST.get('title', '').strip(),
			completed = request.POST.get('completed') == 'true',
		)
		return redirect('todo:detail', todo_id = todo.id)
	return render(request, 'todo/upsert.html')


def delete( request, todo_id ) :
	todo = get_object_or_404(Todo, id = todo_id)
	if request.method == 'POST' :
		todo.delete()
		return redirect('todo:index')
	return render(request, 'todo/delete.html', { 'todo' : todo })


def update( request, todo_id ) :
	todo = get_object_or_404(Todo, id = todo_id)
	if request.method == 'POST' :
		todo.title = request.POST.get('title', '').strip()
		todo.completed = request.POST.get('completed') == 'true'
		todo.save()
		return redirect('todo:detail', todo_id = todo.id)
	return render(request, 'todo/upsert.html', { 'todo' : todo })


def detail( request, todo_id ) :
	todo = get_object_or_404(Todo, id = todo_id)
	return render(request, 'todo/detail.html', { 'todo' : todo })
