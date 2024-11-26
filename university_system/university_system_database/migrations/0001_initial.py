# Generated by Django 5.1.3 on 2024-11-25 15:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Community',
            fields=[
                ('community_id', models.AutoField(primary_key=True, serialize=False)),
                ('community_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Courses',
            fields=[
                ('course_id', models.AutoField(primary_key=True, serialize=False)),
                ('course_name', models.CharField(max_length=255)),
                ('course_code', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Facilities',
            fields=[
                ('facilities_id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=50)),
                ('occupancy_rate', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('role', models.CharField(choices=[('student', 'Student'), ('instructor', 'Instructor'), ('admin', 'Admin')], max_length=50)),
                ('mail_address', models.EmailField(max_length=100, unique=True)),
                ('department', models.CharField(blank=True, max_length=100, null=True)),
                ('first_name', models.CharField(max_length=50)),
                ('middle_name', models.CharField(blank=True, max_length=50, null=True)),
                ('last_name', models.CharField(max_length=50)),
                ('cafeteria_balance', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('profile_photo_path', models.CharField(blank=True, max_length=255, null=True)),
                ('birthday', models.DateField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=11, null=True)),
                ('scholarship_rate', models.DecimalField(blank=True, decimal_places=2, max_digits=3, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ActivityArea',
            fields=[
                ('room_id', models.AutoField(primary_key=True, serialize=False)),
                ('capacity', models.IntegerField()),
                ('is_empty', models.BooleanField(default=True)),
                ('facilities', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.facilities')),
            ],
        ),
        migrations.CreateModel(
            name='Instructor',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='university_system_database.user')),
                ('room', models.CharField(blank=True, max_length=8, null=True)),
                ('room_phone_num', models.CharField(blank=True, max_length=11, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='university_system_database.user')),
                ('gpa', models.DecimalField(blank=True, decimal_places=2, max_digits=4, null=True)),
                ('burs', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('post_id', models.AutoField(primary_key=True, serialize=False)),
                ('is_official', models.BooleanField(default=False)),
                ('post_description', models.TextField()),
                ('header', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.user')),
                ('owner_course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='university_system_database.courses')),
            ],
        ),
        migrations.CreateModel(
            name='CourseEnrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.courses')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.user')),
            ],
            options={
                'unique_together': {('course', 'user')},
            },
        ),
        migrations.CreateModel(
            name='CommunityJoin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(max_length=50)),
                ('community', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.community')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.user')),
            ],
            options={
                'unique_together': {('community', 'user')},
            },
        ),
        migrations.CreateModel(
            name='Likes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.user')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.post')),
            ],
            options={
                'unique_together': {('post', 'owner')},
            },
        ),
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('context', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.user')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.post')),
            ],
            options={
                'unique_together': {('owner', 'post')},
            },
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.facilities')),
                ('reserve_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.user')),
            ],
            options={
                'unique_together': {('facility', 'reserve_user', 'date')},
            },
        ),
        migrations.CreateModel(
            name='Share',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.user')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.post')),
            ],
            options={
                'unique_together': {('post', 'owner')},
            },
        ),
        migrations.CreateModel(
            name='Teaches',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.courses')),
                ('instructor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='university_system_database.instructor')),
            ],
            options={
                'unique_together': {('course', 'instructor')},
            },
        ),
    ]