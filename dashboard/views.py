from django.shortcuts import render
from django.http import HttpResponse 

def home(request):
    return render(request, 'dashboard/dashboard.html')

def relax(request):
    pass

def agenda(request):
    pass

def search(request):
    pass
