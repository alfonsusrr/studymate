# Generated by Django 3.2.9 on 2022-01-03 06:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notes', '0008_auto_20220103_0621'),
    ]

    operations = [
        migrations.AddField(
            model_name='notesratingvotes',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rating_votes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='notesratingvotes',
            name='notes_rating',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='notes.notesrating'),
        ),
    ]