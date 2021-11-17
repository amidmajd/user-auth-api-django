from django.urls import path
from . import views


app_name = 'users'

urlpatterns = [
    path('register', views.RegisterView.as_view(),  name="register"),
    path('login', views.LoginView.as_view(),  name="login"),
    path('logout', views.LogoutView.as_view(),  name="logout"),
    path('user', views.UserView.as_view(),  name="user"),
    path('users', views.UsersView.as_view(),  name="users"),
    path('update/<int:id>', views.UpdateView.as_view(),  name="update"),
]
