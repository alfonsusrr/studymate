from django import forms
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from .models import *
from dashboard.models import *
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json

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

@csrf_exempt
def settings(request):
    if request.method == 'POST':
        data = request.POST
        method = data["method"]
        
        music = data["music"].split(",")
        text = data["text"].split(",")

        for i in range(len(text)):
            text[i] = text[i].replace("&comma", ",")

        image = None
        image_link = None
        return_image = None
        img_change = data["image_change"]
        if img_change == "True":
            if method == "local":
                image = request.FILES['image']
            else:
                image_link = data["image"]

        if data["default_image"] == "true":
            default_image = True
        else:
            default_image = False
        if data["default_text"] == "true":
            default_text = True
        else:
            default_text = False
        if data["default_music"] == "true":
            default_music = True
        else:
            default_music = False

        settings = RelaxSettings.objects.filter(user=request.user).first()
        if settings == None:
            settings = RelaxSettings(user=request.user, local_image=image, link_image=image_link, use_default_image=default_image, use_default_music=default_music, use_default_text=default_text)
            settings.save()
        else:
            if img_change == "True":
                if method == "link":
                    settings.local_image = None
                    settings.link_image = image_link
                else:
                    settings.local_image = image
                    settings.link_image = None
            settings.use_default_image=default_image
            settings.use_default_text=default_text
            settings.use_default_music=default_music
            settings.save()

            if method == "link":
                return_image = image_link
            else:
                return_image = "/media/" + str(settings.local_image)
        
        musicDB = MusicLinks.objects.filter(owner__user=request.user)
        for m in musicDB:
            if len(music) != 0:
                m.link = music.pop(0)
                m.save()
            else:
                m.delete()
        for m in music:
            musicAdd = MusicLinks(owner=settings, link=m)
            musicAdd.save()
        
        textDB = RelaxText.objects.filter(owner__user=request.user)
        for t in textDB:
            if len(text) != 0:
                t.text = text.pop(0)
                t.save()
            else:
                t.delete()
        for t in text:
            textAdd = RelaxText(owner=settings, text=t)
            textAdd.save()
        return HttpResponse(return_image)
    else:
        settings = RelaxSettings.objects.filter(user=request.user).first()
        musicList = MusicLinks.objects.filter(owner__user=request.user)
        texts = RelaxText.objects.filter(owner__user=request.user)
        d_music = True
        d_image = True
        d_text = True

        musicLink = []
        textList = []
        for music in musicList:
            musicLink.append(music.link)
        for text in texts:
            textList.append(text.text)

        musicLink = json.dumps(musicLink)
        textList = json.dumps(textList)

        if settings is None:
            image = None
            method = "default"
        else:
            if settings.link_image is not None:
                image = settings.link_image
                method = "link"
            else:
                image = settings.local_image
                method = "local"
            d_image = settings.use_default_image
            d_music = settings.use_default_music
            d_text = settings.use_default_text
        context = {
            "private" : request.user.hide_email,
            "bgimage" : image,
            "method": method,
            "music": musicLink,
            "text": textList,
            "d_music": d_music,
            "d_image": d_image,
            "d_text": d_text
        }
        return render(request, "account/settings.html", context)

@login_required
@csrf_exempt
def profile_edit(request):
    if request.method == "POST":
        files = request.FILES
        data = request.POST

        for file in files:
            if file == "profile":
                request.user.profile_image = files[file]
            elif file =="cover":
                request.user.cover_image = files[file]
        
        bio = data["bio"]
        name = data["name"]
        username = data["username"]
        if name != "":
            request.user.name = name
        if username != "":
            request.user.username = username
        request.user.bio = bio
        request.user.save()
        return HttpResponse(json.dumps([str(request.user.cover_image), str(request.user.profile_image)]))
    else:
        return render(request, "account/edit.html")