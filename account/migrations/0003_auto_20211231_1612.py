# Generated by Django 3.2.9 on 2021-12-31 16:12

import account.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_auto_20211227_1237'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='cover_image',
            field=models.ImageField(blank=True, default='profile_images/cover.jpg', max_length=255, null=True, upload_to=account.models.get_cover_image_filepath),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(blank=True, default='profile_images/profile.jpg', max_length=255, null=True, upload_to=account.models.get_profile_image_filepath),
        ),
    ]
