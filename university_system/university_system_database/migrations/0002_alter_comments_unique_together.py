# Generated by Django 5.1.3 on 2024-11-27 20:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('university_system_database', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='comments',
            unique_together=set(),
        ),
    ]
