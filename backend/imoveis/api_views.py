from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from .models import Imovel, ImagemImovel, Perfil
from .serializers import (
    ImovelListSerializer, ImovelDetailSerializer, ImovelCreateUpdateSerializer,
    ImagemImovelSerializer, UserSerializer, RegisterSerializer
)
from .filters import ImovelFilter


class ImovelViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de Imóveis
    """
    queryset = Imovel.objects.filter(ativo=True).select_related('dono').prefetch_related('imagens')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ImovelFilter
    search_fields = ['titulo', 'descricao', 'bairro']
    ordering_fields = ['preco', 'criado_em', 'visualizacoes']
    ordering = ['-criado_em']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ImovelListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ImovelCreateUpdateSerializer
        return ImovelDetailSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save(dono=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrementa visualizações
        instance.visualizacoes += 1
        instance.save(update_fields=['visualizacoes'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def meus_imoveis(self, request):
        """Retorna apenas os imóveis do usuário logado"""
        imoveis = self.queryset.filter(dono=request.user)
        serializer = ImovelListSerializer(imoveis, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_ativo(self, request, pk=None):
        """Ativa/desativa um imóvel"""
        imovel = self.get_object()
        
        if imovel.dono != request.user:
            return Response(
                {'error': 'Você não tem permissão para modificar este imóvel.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        imovel.ativo = not imovel.ativo
        imovel.save()
        
        serializer = self.get_serializer(imovel)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def destaques(self, request):
        """Retorna imóveis em destaque (os 6 mais recentes)"""
        imoveis = self.queryset[:6]
        serializer = ImovelListSerializer(imoveis, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estatisticas(self, request):
        """Retorna estatísticas gerais"""
        total = Imovel.objects.count()
        ativos = Imovel.objects.filter(ativo=True).count()
        por_tipo = {}
        
        for tipo_code, tipo_nome in Imovel.TIPO_CHOICES:
            por_tipo[tipo_nome] = Imovel.objects.filter(tipo=tipo_code, ativo=True).count()
        
        return Response({
            'total': total,
            'ativos': ativos,
            'por_tipo': por_tipo
        })


class MeuPerfilView(generics.RetrieveUpdateAPIView):
    """View para visualizar e atualizar o perfil do usuário logado"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class RegisterView(generics.CreateAPIView):
    """View para registro de novos usuários"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Criar token para o usuário
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """View personalizada para login"""
    from django.contrib.auth import authenticate
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    
    return Response(
        {'error': 'Credenciais inválidas'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """View personalizada para logout"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Logout realizado com sucesso'})
    except:
        return Response(
            {'error': 'Erro ao fazer logout'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Retorna informações do usuário logado"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
