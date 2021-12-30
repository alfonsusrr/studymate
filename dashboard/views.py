from django.shortcuts import render
from django.http import HttpResponse 
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from .models import *
import datetime
import json

@login_required
def home(request):
    today = datetime.date.today()
    user = request.user
    agenda = Agenda.objects.filter(owner=user)
    agenda = agenda.values()
    data = []
    for a in agenda:
        for content in a:
            if isinstance(a[content], (datetime.date, datetime.datetime)):
                if a[content] == today:
                    a[content] = a[content].strftime("%Y-%m-%d")
                    data.append(a)
    dataJSON = json.dumps(data)
    context = {
        "agenda": dataJSON
    }
    return render(request, 'dashboard/dashboard.html', context)

@login_required
def relax(request):
    video = []
    image = ""
    context = {
        'user_name': request.user.name,
        'video': video,
        'bgimage': image,
    }
    return render(request, 'dashboard/relax.html', context)

@login_required
def agenda(request):
    if request.method == 'POST':
        if request.POST.get("action") == "add":
            title = request.POST.get("title")
            due = request.POST.get("date")
            
            user = request.user
            agenda = Agenda(owner=user, title=title, due=due)
            agenda.save()
            return HttpResponse(agenda.pk)

        elif request.POST.get("action") == "delete":
            id = int(request.POST.get("id"))
            agendaObj = Agenda.objects.get(pk=id)
            agendaObj.delete()
            return HttpResponse(200, "Deleted")

        elif request.POST.get("action") == "completed":
            id = int(request.POST.get("id"))
            agendaObj = Agenda.objects.get(pk=id)
            if agendaObj.completed == False:
                agendaObj.completed = True
            else:
                agendaObj.completed = False
            agendaObj.save()
            return HttpResponse(200, "Completed")

    else:
        user = request.user
        agenda = Agenda.objects.filter(owner=user)
        agenda = agenda.values()
        data = []
        for a in agenda:
            for content in a:
                if isinstance(a[content], (datetime.date, datetime.datetime)):
                    a[content] = a[content].strftime("%Y-%m-%d")
            data.append(a)
        dataJSON = json.dumps(data)
        context = {
            "agenda": dataJSON
        }
        return render(request, 'dashboard/agenda.html', context)

@login_required
def search(request):
    return render(request, 'dashboard/search.html')
