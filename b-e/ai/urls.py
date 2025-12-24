from django.urls import path
from . import views

urlpatterns = [
    path('', views.hello, name='hello'),
    path('chat/', views.chat, name='chat'),
]