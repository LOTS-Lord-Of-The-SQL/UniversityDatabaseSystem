# authentication/forms.py
from django import forms

class LoginForm(forms.Form):
    email = forms.CharField(max_length=63)
    password = forms.CharField(max_length=63, widget=forms.PasswordInput)