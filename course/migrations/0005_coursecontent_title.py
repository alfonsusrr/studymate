# Generated by Django 3.2.9 on 2022-01-06 16:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0004_auto_20220106_1635'),
    ]

    operations = [
        migrations.AddField(
            model_name='coursecontent',
            name='title',
            field=models.CharField(default='', max_length=200),
        ),
    ]
