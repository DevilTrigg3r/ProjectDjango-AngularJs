from django.conf.urls import url
from django.urls import path
from django.urls.conf import re_path
from .views import (CreateGenbankByAccNumber
)
urlpatterns=[
    path('', CreateGenbankByAccNumber),
]
