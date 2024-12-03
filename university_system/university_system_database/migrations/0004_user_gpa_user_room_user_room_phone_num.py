# Generated by Django 5.1.3 on 2024-11-30 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('university_system_database', '0003_activityarea_room_name_reservationarea'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='gpa',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='room',
            field=models.CharField(blank=True, max_length=8, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='room_phone_num',
            field=models.CharField(blank=True, max_length=11, null=True),
        ),
    ]