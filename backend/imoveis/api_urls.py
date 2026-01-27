from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    ImovelViewSet, MeuPerfilView, RegisterView,
    login_view, logout_view, me_view
)

router = DefaultRouter()
router.register(r'imoveis', ImovelViewSet, basename='imovel')

urlpatterns = [
    # Rotas do router
    path('', include(router.urls)),
    
    # Autenticação
    path('auth/register/', RegisterView.as_view(), name='api-register'),
    path('auth/login/', login_view, name='api-login'),
    path('auth/logout/', logout_view, name='api-logout'),
    path('auth/me/', me_view, name='api-me'),
    
    # Perfil
    path('perfil/', MeuPerfilView.as_view(), name='api-perfil'),
]
