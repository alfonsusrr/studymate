from django import forms
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from .models import *

def profile(request):
    return render(request, 'account/profile.html')

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        return HttpResponseRedirect(reverse("login"))
    return render(request, 'account/register.html')

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        print(authenticate(username="alfonsus.rr", password="admin"))
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('dashboard'))
        else:
            return render(request, 'account/login.html', {
                "message" : "Invalid credentials"
            })
    return render(request, 'account/login.html')

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('login'))

def settings(request):
    pass

