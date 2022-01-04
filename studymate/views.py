from django.shortcuts import render
from django.http import HttpResponse 
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import *
import datetime
import json

def help(request):
    return render (request, 'dashboard/help.html')

def about(request):
    return render (request, 'dashboard/about.html')