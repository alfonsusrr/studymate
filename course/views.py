from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect, HttpResponse
import json

from .models import *

def preview(request, id):
    course = Course.objects.filter(id=id).first()
    if course == None:
        return HttpResponse("Course not found")
    else:
        instructors = course.instructors.all()
        context = {
            "course": course,
            "instructors": instructors
        }
        return render(request, "course/preview.html", context)

def learn(request, id):
    return render(request, "course/learn.html")

def search(request):
    return render(request, "course/search.html")

def my_course(request):
    return render(request, "course/mycourse.html")

@csrf_exempt
def make_course(request):
    if request.method == "POST":
        data = request.POST
        files = request.FILES

        name = data["name"]
        desc = data["desc"]
        categories = json.loads(data["categories"])
        contents = json.loads(data["content"])
        instructors = json.loads(data["instructors"])
        
        thumbnail = ""
        profile_instructors = {}
        for file in files: 
            if file == "thumbnail":
                thumbnail = files[file]
            else:
                owner = int(file.split("-")[-1])
                profile_instructors[owner] = files[file]
        i = 0

        instructorsDB = []
        for instructor in instructors:
            image = profile_instructors.get(i, 0)
            if image == 0:
                instructorModel = CourseInstructor(name=instructor)
            else:
                instructorModel = CourseInstructor(name=instructor, profile_image=image)
            instructorModel.save()
            instructorsDB.append(instructorModel)
            i += 1
        categoriesDB =[]
        for category in categories:
            categoryDB = CourseCategory.objects.filter(name=category).first()
            if categoryDB == None:
                categoryDB = CourseCategory(name=category)
                categoryDB.save()
            categoriesDB.append(categoryDB)
        
        if thumbnail != "":
            course = Course(name=name, description=desc, banner_image=thumbnail)
        else:
            course = Course(name=name, description=desc, banner_image=thumbnail)
        course.save()

        for category in categoriesDB:
            course.categories.add(category)
        
        for instructor in instructorsDB:
            course.instructors.add(instructor)
        course.save()

        for i in range(len(contents)):
            content_group = CourseContentGroup(course=course, title=contents[i]["subTopicTitle"], order=i+1)
            content_group.save()
            for j in range(len(contents[i]["contents"])):
                content_now = contents[i]["contents"][j]
                
                title = content_now["title"]
                type = content_now["type"]

                if type == "text":
                    isVideo = False 
                else:
                    isVideo = True
                
                video_link = content_now["video_link"]
                text_content = content_now["text_content"]
                content = CourseContent(content_group=content_group, title=title, is_video=isVideo, video_link=video_link, content=text_content, order=j+1)
                content.save()
    return render(request, "course/add.html")
    