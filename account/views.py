from django import forms
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .models import *
from dashboard.models import *
from django.contrib.auth.decorators import login_required

@login_required
def profile(request):
    return render(request, 'account/profile.html')

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        name = request.POST.get('name')
        email = request.POST.get('email')

        if username and password and name and email:
            user = User.objects.filter(username=username).first()
            if user is not None:
                context = {
                    "username" : username,
                    "password" : password,
                    "name" : name,
                    "email" : email,
                    "message" : "Username already exists. Please choose other username"
                }
                return render(request, 'account/register.html', context)
            user = User.objects.filter(email=email).first()
            if user is not None:
                context = {
                    "username" : username,
                    "password" : password,
                    "name" : name,
                    "email" : email,
                    "message" : "Email already registered. Please login"
                }
                return render(request, 'account/register.html', context)

            user = User.objects.create_user(username=username, email=email, name=name, password=password)           
            return HttpResponseRedirect(reverse("login"))
        else:
            return render(request, 'account/register.html')
    return render(request, 'account/register.html')

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
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
    if request.method == 'POST':
        return HttpResponse('200')
    else:
        background = RelaxSettings.objects.filter(user=request.user).first()
        music = MusicLinks.objects.filter(owner__user=request.user).first()
        if music is None:
            music = False
        if background is None:
            background = False
        context = {
            "private" : request.user.hide_email,
            "background" : background,
            "music": music
        }
        return render(request, "account/settings.html", context)
