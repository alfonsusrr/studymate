# Generated by Django 3.2.9 on 2022-01-01 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0004_auto_20220101_1047'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notescategory',
            name='name',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]