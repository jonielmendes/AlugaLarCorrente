from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Imovel, ImagemImovel, Perfil


class PerfilSerializer(serializers.ModelSerializer):
    """Serializer para o Perfil do usuário"""
    class Meta:
        model = Perfil
        fields = ['tipo', 'telefone']


class UserSerializer(serializers.ModelSerializer):
    """Serializer para o modelo User"""
    perfil = PerfilSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'perfil']


class ImagemImovelSerializer(serializers.ModelSerializer):
    """Serializer para imagens adicionais do imóvel"""
    class Meta:
        model = ImagemImovel
        fields = ['id', 'imagem', 'descricao', 'ordem']


class ImovelListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de imóveis"""
    dono_nome = serializers.CharField(source='dono.username', read_only=True)
    bairro_display = serializers.CharField(source='get_bairro_display', read_only=True)
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    whatsapp_link = serializers.CharField(source='get_whatsapp_link', read_only=True)
    
    class Meta:
        model = Imovel
        fields = [
            'id', 'titulo', 'preco', 'bairro', 'bairro_display', 
            'tipo', 'tipo_display', 'foto_principal', 'ativo',
            'dono_nome', 'visualizacoes', 'criado_em', 'whatsapp_link'
        ]


class ImovelDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalhes do imóvel"""
    dono = UserSerializer(read_only=True)
    imagens = ImagemImovelSerializer(many=True, read_only=True)
    bairro_display = serializers.CharField(source='get_bairro_display', read_only=True)
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    whatsapp_link = serializers.CharField(source='get_whatsapp_link', read_only=True)
    
    class Meta:
        model = Imovel
        fields = [
            'id', 'titulo', 'descricao', 'preco', 'bairro', 'bairro_display',
            'tipo', 'tipo_display', 'telefone_contato', 'foto_principal',
            'ativo', 'visualizacoes', 'criado_em', 'atualizado_em',
            'dono', 'imagens', 'whatsapp_link'
        ]


class ImovelCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criar/atualizar imóveis"""
    imagens_upload = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Imovel
        fields = [
            'titulo', 'descricao', 'preco', 'bairro', 'tipo',
            'telefone_contato', 'foto_principal', 'ativo', 'imagens_upload'
        ]
    
    def create(self, validated_data):
        imagens_data = validated_data.pop('imagens_upload', [])
        imovel = Imovel.objects.create(**validated_data)
        
        # Criar imagens adicionais
        for idx, imagem in enumerate(imagens_data):
            ImagemImovel.objects.create(
                imovel=imovel,
                imagem=imagem,
                ordem=idx
            )
        
        return imovel
    
    def update(self, instance, validated_data):
        imagens_data = validated_data.pop('imagens_upload', [])
        
        # Atualizar campos do imóvel
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Adicionar novas imagens
        if imagens_data:
            ordem_inicial = instance.imagens.count()
            for idx, imagem in enumerate(imagens_data):
                ImagemImovel.objects.create(
                    imovel=instance,
                    imagem=imagem,
                    ordem=ordem_inicial + idx
                )
        
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para registro de novos usuários"""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    tipo = serializers.ChoiceField(choices=Perfil.TIPO_USUARIO, write_only=True)
    telefone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'tipo', 'telefone']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "As senhas não conferem."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        tipo = validated_data.pop('tipo')
        telefone = validated_data.pop('telefone', '')
        
        user = User.objects.create_user(**validated_data)
        
        # Atualizar perfil
        user.perfil.tipo = tipo
        user.perfil.telefone = telefone
        user.perfil.save()
        
        return user
