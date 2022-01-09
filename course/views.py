from django.http.response import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.forms.models import model_to_dict
from django.core import serializers
import json
from django.urls import reverse
from .models import *
import markdown as md
from PIL import Image
import os
import uuid
from studymate.settings import MEDIA_ROOT as media
import datetime

def preview(request, id):
    course = Course.objects.filter(id=id).first()
    if course == None:
        return HttpResponse("Course not found")
    else:
        instructors = course.instructors.all()
        categories = course.categories.all()

        contents = []
        content_groups = []
        content_groupsDB = CourseContentGroup.objects.filter(course=course).order_by("order")
        for content_group in content_groupsDB:
            content = CourseContent.objects.filter(content_group = content_group).order_by("order")
            content_group = {"title": content_group.title, "contents": content}
            content_groups.append(content_group)
            
        usercourseDB = UserCourse.objects.filter(user=request.user, course__id=id).first()
        if usercourseDB == None:
            enrolled = False
        else:
            enrolled = True
        context = {
            "course": course,
            "instructors": instructors,
            "categories": categories,
            "content_groups": content_groups,
            "enrolled": enrolled
        }
        return render(request, "course/preview.html", context)

def enroll(request, course_id):
    if request.method == "POST":
        userCourseDB = UserCourse.objects.filter(user=request.user, course__id=course_id).first()
        
        if userCourseDB == None:
            course = Course.objects.filter(id=course_id).first()
            usercourseDB = UserCourse(user=request.user, course=course)
            usercourseDB.save()

            firstContentGroup = CourseContentGroup.objects.filter(course=course).order_by("order").first()
            firstContent = CourseContent.objects.filter(content_group=firstContentGroup).order_by("order").first()

            userProgress = CourseUserProgress(info=usercourseDB, last_content=firstContent.id)
            contents = CourseContent.objects.filter(content_group__course=course)
            for content in contents:
                userContentProgress = ContentUserProgress(content=content, user=request.user)
                userContentProgress.save()

            contentgroups = CourseContentGroup.objects.filter(course=course)
            for group in contentgroups:
                userContentGroupProgress = ContentGroupUserProgress(content_group=group, user=request.user)
                userContentGroupProgress.save()
        output = {
            "status": "success"
        }
        return JsonResponse(output)
    else:
        return HttpResponse("Forbidden")

def unenroll(request):
    if request.method == "POST":
        data = request.POST
        course_id = data.get("id", -1)
        userCourseDB = UserCourse.objects.filter(user=request.user, course__id=course_id).first()
        if userCourseDB != None:
            course = Course.objects.filter(id=course_id).first()
            userCourseProgress = CourseUserProgress.objects.filter(info=userCourseDB)
            userCourseProgress.delete()
            userCourseDB.delete()

            userContentsProgress = ContentUserProgress.objects.filter(content__content_group__course=course, user=request.user)
            for userContent in userContentsProgress:
                userContent.delete()
            
            userContentGroupProgress = ContentGroupUserProgress.objects.filter(content_group__course=course, user=request.user)
            for group in userContentGroupProgress:
                group.delete()
        output = {
            "status": "success"
        }
        return JsonResponse(output)
        
def resetLastContent(userprogress, course_id):
    firstContentGroup = CourseContentGroup.objects.filter(course__id=course_id).order_by("order").first()
    firstContent = CourseContent.objects.filter(content_group=firstContentGroup).order_by("order").first()

    userprogress.last_content = firstContent.id
    userprogress.save()
    return firstContent

def learn(request, course_id):
    usercourseDB = UserCourse.objects.filter(course__id=course_id, user=request.user).first()
    if usercourseDB == None:
        return HttpResponseRedirect(reverse("course_preview", args=[course_id]))
    else:
        userprogress = CourseUserProgress.objects.filter(info=usercourseDB).first()
        if userprogress == None:
            userprogress = CourseUserProgress(info=usercourseDB)
            userprogress.save()
        course = Course.objects.filter(id=course_id).first()

        last_group = CourseContent.objects.filter(id=userprogress.last_content).first()
        
        if last_group == None:
            last_group = resetLastContent(userprogress, course_id)
        
        last_group = last_group.content_group.id

        context = {
            "user_data": usercourseDB,
            "progress": userprogress,
            "course": course,
            "last_content_group": last_group
        }
        return render(request, "course/learn.html", context)

def search(request):
    return render(request, "course/search.html")

def my_course(request):
    course_inprogress = UserCourse.objects.filter(user=request.user, completed=False).order_by("-start_date")
    course_completed = UserCourse.objects.filter(user=request.user, completed=True).order_by("-complete_date")
    course_byuser = Course.objects.filter(maker=request.user)

    context = {
        "course_inprogress": course_inprogress,
        "course_completed": course_completed,
        "course_byuser": course_byuser
    }
    return render(request, "course/mycourse.html", context)

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
        output = {
            "status": "success",
            "url": reverse("course_preview", args=[course.id])
        }
        return JsonResponse(output)
    return render(request, "course/add.html")
    
@csrf_exempt
def upload_image(request):
    if request.method == "POST":
        file = request.FILES
        data = request.POST

        if len(file) != 0:
            img = Image.open(file["image"])
            filename_before = file["image"].name
            filename = "/course/content/uploads/" + str(uuid.uuid4()) + ".jpg"
            img.save(media + filename, "JPEG")
            output = {
                "status": "success",
                "url": "/media" + filename,
                "filename": filename_before
            }
        else:
            output = {
                "status": "failed"
            }
        return JsonResponse(output)

@csrf_exempt
def markdown(request):
    if request.method == "POST":
        data = request.POST
        text = data["text"]
        md_ext = md.Markdown(extensions=["markdown_markup_emoji.markup_emoji", 'mdx_math', 'tables', 'footnotes', 'def_list', 'abbr', 'attr_list', 'fenced_code'])
        html = md_ext.convert(text)
        output = {
            "status": "success",
            "html": html
        }
        return JsonResponse(output)

def markdown_func(text):
    md_ext = md.Markdown(extensions=["markdown_markup_emoji.markup_emoji", 'mdx_math', 'tables', 'footnotes', 'def_list', 'abbr', 'attr_list', 'fenced_code'])
    html = md_ext.convert(text)
    return html

@login_required
def finishContent(request):
    if request.method == "POST":
        content_id = request.POST.get("id", -1)
        if content_id != -1:
            userContentProgress = ContentUserProgress.objects.filter(content__id=content_id, user=request.user).first()
            if userContentProgress == None:
                output = {
                    "status": "failed"
                }
            else:
                if userContentProgress.completed == False:
                    userContentProgress.completed = True
                    userContentProgress.save()

                    courseContentDB = CourseContent.objects.filter(id=content_id).first()

                    checkFinishGroup(request, courseContentDB.content_group)
                output = {
                    "status": "success"
                }
        else:
            output = {
                "status": "failed"
            }
        return JsonResponse(output)


def checkFinishGroup(request, content_group):
    contentsDB = ContentUserProgress.objects.filter(content__content_group=content_group, user=request.user)
    finish = True
    for content in contentsDB:
        if content.completed == False:
            finish = False
    if finish == True:
        userContentGroupProgress = ContentGroupUserProgress.objects.filter(content_group=content_group, user=request.user).first()
        userContentGroupProgress.completed = True
        userContentGroupProgress.save()
    

@login_required
def completeContent(request):
    status = "failed"
    if request.method == "POST":
        data = request.POST
        content_id = data["id"]

        userContentProgress = ContentUserProgress.objects.filter(content__id=content_id, user=request.user).first()
        if userContentProgress != None:
            userContentProgress.completed = True
            userContentProgress.save()
            checkFinishGroup(request, userContentProgress.content.content_group)
            status = "success"
    output = {
        "status": status
    }
    return JsonResponse(output)
    
@login_required
def setLastViewed(request):
    status = "failed"
    if request.method == "POST":
        data = request.POST
        content_id = data["id"]
        content = CourseContent.objects.filter(id=content_id).first()
        if content != None:
            course = content.content_group.course
            userprogress = CourseUserProgress.objects.filter(info__course=course).first()
            if userprogress != None:
                userprogress.last_content = content_id
                userprogress.save()
                status = "success"
    output = {
        'status': status
    }
    return JsonResponse(output)

@login_required
def validateCompletion(request):
    status = "failed"
    completed = False
    if request.method == "POST":
        data = request.POST
        course_id = data.get("id", -1)
        if course_id != -1:
            userGroupProgress = ContentGroupUserProgress.objects.filter(content_group__course__id=course_id, user=request.user)
            completed = True
            for progress in userGroupProgress:
                if progress.completed == False:
                    completed = False
            if completed:
                userCourseInfo = UserCourse.objects.filter(user=request.user, course__id=course_id).first()
                if userCourseInfo != None:
                    if userCourseInfo.completed == False:
                        userCourseInfo.completed = True
                        userCourseInfo.complete_date = datetime.datetime.now()
                        userCourseInfo.save()
                        status = "success"
    output = {
        "status": status,
        "completed": completed
    }
    return JsonResponse(output)

@login_required
def getCourseInfo(request):
    data = request.GET
    by = data["by"]
    course = data.get("course", -1)
    group = data.get("group", -1)
    content = data.get("content", -1)

    data = {}
    status = "failed"
    if by != -1:
        if by == "course":
            if course != -1:
                courseDB = Course.objects.filter(id=course)
                if len(courseDB) != 0:
                    userCourse = UserCourse.objects.filter(user=request.user, course=courseDB.first()).first()
                    if userCourse != None:
                        status = "success"
                        courseDB = Course.objects.filter(id=course)
                        course_info = list(courseDB.values())[0]
                        groupDB = CourseContentGroup.objects.filter(course=courseDB.first()).order_by('order')
                        group_info = list(groupDB.values())
                        content_info = None
                        data["course"] = course_info
                        data["groups"] = group_info

        elif by == "group":
            if group != -1:
                groupDB = CourseContentGroup.objects.filter(id=group).first()
                if groupDB != None:
                    courseDB = groupDB.course
                    userCourse = UserCourse.objects.filter(user=request.user, course=courseDB).first()
                    if userCourse != None:
                        status = "success"
                        contentsDB = CourseContent.objects.filter(content_group=groupDB).order_by('order')

                        info = json.loads(serializers.serialize('json', [courseDB, groupDB]))
                        data["course"] = info[0]["fields"]
                        data["groups"] = info[1]["fields"]
                        data["contents"] = list(contentsDB.values('id', 'title', 'is_video'))

        elif by == "content":
            if content != -1:
                contentDB = CourseContent.objects.filter(id=content).first()
                if contentDB != None:
                    groupDB = contentDB.content_group
                    courseDB = groupDB.course

                    userCourse = UserCourse.objects.filter(user=request.user, course=courseDB).first()
                    if userCourse != None:
                        status = "success"
                        info = json.loads(serializers.serialize('json', [courseDB, groupDB, contentDB]))
                        data["course"] = info[0]["fields"]
                        data["groups"] = info[1]["fields"]
                        data["contents"] = info[2]["fields"]
                        data["contents"]["content"] = markdown_func(data["contents"]["content"])

    output = {
        "status": status,
        "data": data
    }
    return JsonResponse(output)

@login_required
def getUserCourseInfo(request):
    data = request.GET
    by = data["by"]
    course = data.get("course", -1)
    group = data.get("group", -1)

    data = {}
    status = "failed"
    if by != -1:
        if by == "course":
            if course != -1:
                courseDB = Course.objects.filter(id=course)
                if len(courseDB) != 0:
                    userCourse = UserCourse.objects.filter(user=request.user, course=courseDB.first()).first()
                    if userCourse != None:
                        status = "success"
                        contentGroupProgress = ContentGroupUserProgress.objects.filter(content_group__course__id=course).order_by("content_group__order")
                        if len(contentGroupProgress) != 0:
                            groupProgressInfo = list(contentGroupProgress.values())
                            data["group_progress"] = groupProgressInfo
        elif by == "group":
            if group != -1:
                groupDB = CourseContentGroup.objects.filter(id=group)
                if len(groupDB) != 0:
                    userCourse = UserCourse.objects.filter(user=request.user, course=groupDB.first().course).first()
                    if userCourse != None:
                        status = "success"
                        contentProgress = ContentUserProgress.objects.filter(content__content_group__id = group).order_by("content__order")
                        if len(contentProgress) != 0:
                            contentProgressInfo = list(contentProgress.values())
                            data["content_progress"] = contentProgressInfo
        
    output = {
        "status": status,
        "data": data
    }
    return JsonResponse(output)
                    


