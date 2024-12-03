# Generated by Django 5.1.3 on 2024-11-30 11:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('university_system_database', '0004_user_gpa_user_room_user_room_phone_num'),
    ]

    operations = [
        migrations.CreateModel(
            name='CommunityAnnouncement',
            fields=[
                ('announcement_id', models.AutoField(primary_key=True, serialize=False)),
                ('annoucement_description', models.TextField()),
                ('header', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner_community', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='university_system_database.community')),
            ],
        ),
    ]