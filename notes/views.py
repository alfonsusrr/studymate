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
from django.db.models import Q, Value
from django.db.models.functions import Replace
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
    result_page = 10
    if len(private_notes) > result_page:
        more_private = True 
    else:
        more_private = False

    if len(public_notes) > result_page:
        more_public = True 
    else:
        more_public = False
    context = {
        "private_notes": private_notes[:result_page],
        "public_notes": public_notes[:result_page],
        "more_private": more_private,
        "more_public": more_public
    }
    return render(request, "notes/note_archive.html", context)

@login_required
def share(request):
    return render(request, "notes/share.html")

def search(request):
    if request.method == "POST":
        query = request.POST.get("query")
        notes = Notes.objects.filter(is_private=False).filter(Q(title__icontains=query) | Q(description__icontains=query) | Q(categories__name__icontains=query)).order_by('-overall_rating', '-uploaded_on').distinct()

        html_response = loader.render_to_string("notes/notes_search_temp.html", {"notes": notes})
        html_response = html_response.strip()
        output = {
            'status': "success",
            "html_response": html_response
        }
        return JsonResponse(output)

def autocomplete_search(request):
    if 'term' in request.GET:
        notes = Notes.objects.filter(title__icontains=request.GET.get("term"))
        titles = [note.title for note in notes]
        return JsonResponse(titles, safe=False)
    return JsonResponse({})

@login_required
@csrf_exempt
def upload(request):
    if request.method == "POST":
        data = request.POST
        title = data["title"]
        desc = data["desc"]
        private = json.loads(data["private"])
        categories = json.loads(data["category"])
        if data["new"] == "true": 
            file = request.FILES
            file = file["file"]

            categoriesList = []
            for category in categories:
                category = category.lower()
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
            output = {
                "status": "success",
                "message": "File Uploaded!",
                "notes_url": reverse('view_notes', args=[note.id])
            }
            return JsonResponse(output)
        else:
            note_id = data["id"]
            note = Notes.objects.filter(id=note_id).first()

            
            if note == None:
                output = {
                    "status": "failed",
                    "message": "note doesn't exist",
                }
            else:
                try:
                    file = request.FILES["file"]
                except:
                    file = None
                
                if file != None:
                    note.file = file

                note.title = title
                note.description = desc
                note.is_private = private
                note.categories.clear()
                categoriesList = []
                for category in categories:
                    category = category.lower()
                    categoryDB = NotesCategory.objects.filter(name=category).first()
                    if categoryDB == None:
                        categoryDB = NotesCategory(name=category)
                        categoryDB.save()
                    categoriesList.append(categoryDB)
                for category in categoriesList:
                    note.categories.add(category)
                note.save()
                thumbnail_creation(note)
                output = {
                    "status": "success",
                    "message": "File Updated!",
                    "notes_url": reverse('view_notes', args=[note.id])
                }
                return JsonResponse(output)


                


    else:
        context = {
            "new": True
        }
        return render(request, "notes/upload.html", context)
        
@login_required
def get_archive(request):
    if request.method == "POST":
        try:
            query = request.POST.get('query')
        except:
            query = None
        if query != None:
            private_notes = Notes.objects.filter(owner=request.user, title__icontains=query, is_private=True)
            private_html = loader.render_to_string('notes/notes.html', {'notes': private_notes, 'private': True})
            public_notes = Notes.objects.filter(owner=request.user, title__icontains=query, is_private=False)
            public_html = loader.render_to_string('notes/notes.html', {'notes': public_notes, 'private': False})
            private_html = private_html.strip()
            public_html = public_html.strip()
            output = {
                'private_html': private_html,
                'public_html': public_html
            }
            return JsonResponse(output)
        else:
            part = request.POST.get('page')
            private = request.POST.get('private')
            if private == "true":
                private = True
            elif private == "false":
                private = False
            notes = Notes.objects.filter(owner=request.user, is_private=private)
            result_per_page = 10
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

@login_required
def delete_notes(request):
    id = request.POST.get("id")
    notes = Notes.objects.filter(id=id).first()
    if notes.owner != request.user:
        return HttpResponseForbidden
    notes.delete()
    return HttpResponse("Deleted")

@login_required
def view_notes(request, id):
    note = Notes.objects.filter(id=id).first()
    if note == None:
        return Http404
    else:
        user_rating = NotesRating.objects.filter(user=request.user, note=note).first()
        if user_rating == None:
            user_rating = 0
        else:
            user_rating = user_rating.rating
        categories = note.categories.all()
        number_ratings = NotesRating.objects.filter(note=note)
        ratings_with_review = NotesRating.objects.filter(note=note).exclude(review='').order_by('-votes_total', '-last_modified')
        context = {
            "notes": note,
            "categories": categories,
            "user_rating": user_rating,
            "number_ratings": len(number_ratings),
            "reviews": ratings_with_review
        }
        if note.is_private:
            if note.owner == request.user:
                return render(request, 'notes/notes_view.html', context)
            else:
                return HttpResponseForbidden
        else:
            return render(request, 'notes/notes_view.html', context)

@login_required
def rate_notes(request, id):
    note = Notes.objects.filter(id=id).first()
    if note == None:
        output = {
            "status": "failed",
            "message": "Notes doesn't exist"
        }
        return Jsonresponse(output)
    else:
        if request.method == "POST":
            rate = request.POST.get("rate")
            ratingDB = NotesRating.objects.filter(note=note, user=request.user).first()
            if ratingDB == None:
                ratingDB = NotesRating(user=request.user, note=note, rating=rate)
            else:
                ratingDB.rating = rate
            ratingDB.save()

            ratingDB = NotesRating.objects.filter(note=note)
            overall_rate = 0
            for rating in ratingDB:
                overall_rate += rating.rating
            try:
                overall_rate = overall_rate / len(ratingDB)
            except:
                overall_rate = 0
            
            note.overall_rating = overall_rate
            note.save()
            
            output = {
                "status": "success",
                "rating": rate 
            }
            return JsonResponse(output)
        else:
            return HttpResponseForbidden

@login_required
def review_notes(request, id):
    notesRatingDB = NotesRating.objects.filter(note__id=id, user=request.user).first()
    if notesRatingDB == None:
        output = {
            "status": "failed",
            "message": "Rating not found"
        }
        return JsonResponse(output)
    else:
        review = request.POST.get("review")
        notesRatingDB.review = review
        notesRatingDB.save()
        output = {
            "status": "success",
            "review": review,
            "id": notesRatingDB.id
        }
        return JsonResponse(output)

def get_comments_by_id(request, id):
    comment =  NotesRating.objects.filter(id=id)
    comment_html = loader.render_to_string('notes/comments.html', {'reviews': comment})
    comment_html = comment_html.strip()
    output = {
        "status": "success",
        "html_response": comment_html
    }
    return JsonResponse(output)

def vote_comment(request, id):
    if request.method == "POST":
        value = int(request.POST.get("value"))
        notes_rating = NotesRating.objects.filter(id=id).first()
        vote = NotesRatingVotes.objects.filter(owner=request.user, notes_rating__id=id).first()
        if vote == None:
            vote = NotesRatingVotes(owner=request.user, value=value, notes_rating=notes_rating)
        else:
            notes_rating.votes_total -= vote.value
            vote.value = value
        vote.save()
        notes_rating.votes_total += value
        notes_rating.save()

        output = {
            'status': 'success',
            'id': id,
            'total_vote': notes_rating.votes_total
        }
        return JsonResponse(output)
    else:
        return HttpResponseForbidden

def category(request, name):
    notes = Notes.objects.filter(is_private=False).annotate(category_now=Replace('categories__name', Value(' '), Value('-'))).filter(category_now__iexact=name).order_by('-overall_rating', '-uploaded_on')
    context = {
        "category": name.replace("-", " "),
        "notes": notes
    }
    return render(request, "notes/share.html", context)

def edit_notes(request, id):
    notes = Notes.objects.filter(id=id).first()
    categories = notes.categories.all()
    if notes.owner == request.user:
        context = {
            "new": False,
            "note": notes,
            "categories": categories
        }
        return render(request, "notes/upload.html", context)
    else:
        return HttpResponseForbidden