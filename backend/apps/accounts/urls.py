from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import CurrentUserView, LogoutView, RegisterUserView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register-user'),
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout-user'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]
