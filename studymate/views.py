from django.shortcuts import render
from django.http import HttpResponse, HttpResponseServerError
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import *
import datetime
import json

def help(request):
    return render (request, 'dashboard/help.html')

def about(request):
    return render (request, 'dashboard/about.html')

def handler404(request, exception, message = "Page Not Found", template_name="dashboard/error404.html"):
    context = {
        "exception": message
    }
    return render(request, "dashboard/error404.html",  context = context, status=404)

def handler403(request, exception, message = "Forbidden",template_name="dashboard/error403.html"):
    context = {
        "exception": message
    }
    return render(request, "dashboard/error403.html", context = context, status=403)

def handler500(request):
    return render(request, "dashboard/error500.html", status=500)