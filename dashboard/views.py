from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from .models import *
from notes.models import *
import datetime
import json
import random

def welcome(request):
    return render (request, 'dashboard/welcome.html')
    
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

    notes = list(Notes.objects.filter(is_private = False))
    num_notes = min(len(notes), 10)
    random_note = random.sample(notes, num_notes)

    courses = list(Course.objects.all())

    num_courses = min(len(courses), 5)
    random_courses = random.sample(courses, num_courses)
    context = {
        "agenda": dataJSON,
        "random_note": random_note,
        "random_courses": random_courses,
    }
    return render(request, 'dashboard/dashboard.html', context)

@login_required
def relax(request):
    music = []
    text = []

    default_text = ["This is default text", "Always Be Happy!", "Thank you for using studymate"]
    default_music = ["DWcJFNfaw9c"]
    settings = RelaxSettings.objects.filter(user=request.user)
    if len(settings) == 0:
        image = None
        image_method = "default"
        music = default_music
        text = default_text
    else:
        settings = settings[0]
        if settings.link_image is not None:
            image = settings.link_image
            image_method = "link"
        else:
            image = settings.local_image
            image_method = "local"
        if settings.use_default_image:
            image_method = "default"
    
        if settings.use_default_text:
            text = default_text
        else:
            textDB = RelaxText.objects.filter(owner=settings)
            if len(textDB) == 0:
                text = default_text
            else:
                for t in textDB:
                    text.append(t.text)
            
        if settings.use_default_music:
            music = default_music
        else:
            musicDB = MusicLinks.objects.filter(owner=settings)
            if len(musicDB) == 0:
                music = default_music
            else:
                for m in musicDB:
                    music.append(m.link)
    music = json.dumps(music)
    text = json.dumps(text)
    
    context = {
        'user_name': request.user.name,
        'music': music,
        'bgimage': image,
        'image_method': image_method,
        'text': text
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
def agenda_api(request):
    user = request.user
    date = request.GET.get("date", None)

    if date != None:
        try:
            date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
        except:
            return HttpResponse(500)
        agenda = Agenda.objects.filter(owner=user, due=date)
    else:
        agenda = Agenda.objects.filter(owner=user)
    agenda = agenda.values()
    data = []
    for a in agenda:
        for content in a:
            if isinstance(a[content], (datetime.date, datetime.datetime)):
                a[content] = a[content].strftime("%Y-%m-%d")
        data.append(a)
    context = {
        "agenda": data
    }
    return JsonResponse(context)

@login_required
def search(request):
    return render(request, 'dashboard/search.html')
