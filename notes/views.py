from django import forms
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.http.response import Http404, HttpResponseForbidden
from django.shortcuts import render
from django.urls import reverse
from .models import *
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.template import loader
from pdf2image import convert_from_path
from django.conf import settings
from django.core.files.base import ContentFile
from PIL import Image
from io import StringIO, BytesIO

import json

@login_required
def archive(request):
    private_notes = Notes.objects.filter(owner=request.user, is_private=True)
    public_notes = Notes.objects.filter(owner=request.user, is_private=False)
    if len(private_notes) > 5:
        more_private = True 
    else:
        more_private = False

    if len(public_notes) > 5:
        more_public = True 
    else:
        more_public = False
    context = {
        "private_notes": private_notes[:5],
        "public_notes": public_notes[:5],
        "more_private": more_private,
        "more_public": more_public
    }
    return render(request, "notes/note_archive.html", context)

@login_required
def share(request):
    return render(request, "notes/share.html")

@login_required
@csrf_exempt
def upload(request):
    if request.method == "POST":
        file = request.FILES
        data = request.POST

        title = data["title"]
        desc = data["desc"]
        private = json.loads(data["private"])
        file = file["file"]
        categories = json.loads(data["category"])

        categoriesList = []
        for category in categories:
            categoryDB = NotesCategory.objects.filter(name=category).first()
            if categoryDB == None:
                categoryDB = NotesCategory(name=category)
                categoryDB.save()
            categoriesList.append(categoryDB)

        note = Notes(title=title, description=desc, file=file, owner=request.user, is_private=private)
        note.save()
        for category in categoriesList:
            note.categories.add(category)
        
        note.save()
        thumbnail_creation(note)
        return HttpResponse("200")
    else:
        return render(request, "notes/upload.html")

def get_archive(request):
    if request.method == "POST":
        part = request.POST.get('page')
        private = request.POST.get('private')
        if private == "true":
            private = True
        elif private == "false":
            private = False
        notes = Notes.objects.filter(owner=request.user, is_private=private)
        result_per_page = 5
        paginator = Paginator(notes, result_per_page)

        try:
            notes = paginator.page(part)
        except PageNotAnInteger:
            notes = paginator.page(2)
        except EmptyPage:
            notes = paginator.page(paginator.num_pages)

        notes_html = loader.render_to_string('notes/notes.html', {'notes': notes, 'private': private})
        notes_html = notes_html.strip()
        output = {
            'notes_html': notes_html,
            'has_next': notes.has_next()
        }
        return JsonResponse(output)
    else:
        return HttpResponseForbidden

def thumbnail_creation(note):
    img_io = BytesIO()
    path = settings.MEDIA_ROOT + "/" + str(note.file)
    thumbnail = convert_from_path(path)[0]
    thumbnail.save(img_io, format="JPEG", quality=100)
    img_content = ContentFile(img_io.getvalue(), 'thumbnail.jpg')
    note.thumbnail = img_content
    note.save()

def delete_notes(request):
    id = request.POST.get("id")
    notes = Notes.objects.filter(id=id).first()
    if notes.owner != request.user:
        return HttpResponseForbidden
    notes.delete()
    return HttpResponse("Deleted")
