from django.shortcuts import render
from django.http import HttpResponse 
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    return render(request, 'dashboard/dashboard.html')

@login_required
def relax(request):
    return render(request, 'dashboard/relax.html')

@login_required
def agenda(request):
    return render(request, 'dashboard/agenda.html')

@login_required
def search(request):
    return render(request, 'dashboard/search.html')
