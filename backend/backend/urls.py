from django.contrib import admin
from django.urls import path, include
from taskManagerApp import views
from rest_framework import routers
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

router = routers.DefaultRouter()
router.register(r'projects', views.ProjectView, 'project')
router.register(r'lists', views.ListView, 'list')
router.register(r'cards', views.CardView, 'card')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/user', views.user, name='user'),
    path('api/login', views.issue_token, name='issue_token'),
    path('api/logout', views.logout_view, name='logout_view'),
    path('api/signup', views.signup_view, name='signup_view'),
]

# urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
