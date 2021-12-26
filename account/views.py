from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.http import HttpResponse
from django import forms
from django.urls import reverse

user = ["admin", "admin"]
class NewUserForm(forms.Form):
    username = forms.CharField(label="username")
    password = forms.CharField(label="password")

def profile(request):
    return render(request, 'account/profile.html')

def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        return HttpResponseRedirect(reverse("login"))
        
    return render(request, 'account/register.html')

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(username)
        print(password)
        if username == user[0] and password == user[1]:
            request.session["username"] = username
            request.session["password"] = password
            return HttpResponseRedirect(reverse("dashboard"))
    return render(request, 'account/login.html')