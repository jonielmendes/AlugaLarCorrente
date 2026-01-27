from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from urllib.parse import quote


class Perfil(models.Model):
    """
    Extensão do modelo User para adicionar tipo de usuário
    """
    TIPO_USUARIO = (
        ('LOCADOR', 'Locador'),
        ('LOCATARIO', 'Locatário'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    tipo = models.CharField(
        max_length=20, 
        choices=TIPO_USUARIO, 
        default='LOCATARIO',
        verbose_name="Tipo de Usuário"
    )
    telefone = models.CharField(
        max_length=20, 
        blank=True,
        verbose_name="Telefone/WhatsApp"
    )
    
    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"
    
    def __str__(self):
        return f"{self.user.username} - {self.get_tipo_display()}"


@receiver(post_save, sender=User)
def criar_perfil_usuario(sender, instance, created, **kwargs):
    """Cria automaticamente um perfil quando um usuário é criado"""
    if created:
        Perfil.objects.create(user=instance)


@receiver(post_save, sender=User)
def salvar_perfil_usuario(sender, instance, **kwargs):
    """Salva o perfil quando o usuário é salvo"""
    if hasattr(instance, 'perfil'):
        instance.perfil.save()


class Imovel(models.Model):
    """
    Model para representar imóveis disponíveis para aluguel
    """
    
    # Choices para Bairro
    BAIRROS_CHOICES = [
        ('centro', 'Centro'),
        ('nova_corrente', 'Nova Corrente'),
        ('aeroporto_i', 'Aeroporto I'),
        ('aeroporto_ii', 'Aeroporto II'),
        ('vermelhao', 'Vermelhão'),
        ('sincerino', 'Sincerino'),
        ('vila_nova', 'Vila Nova'),
    ]
    
    # Choices para Tipo de Imóvel
    TIPO_CHOICES = [
        ('casa', 'Casa'),
        ('kitnet', 'Kitnet'),
        ('apartamento', 'Apartamento'),
        ('quarto', 'Quarto'),
    ]
    
    # Campos do modelo
    titulo = models.CharField(
        max_length=200,
        verbose_name="Título do Anúncio",
        help_text="Título atrativo para o imóvel"
    )
    
    descricao = models.TextField(
        verbose_name="Descrição",
        help_text="Descrição detalhada do imóvel"
    )
    
    preco = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Preço Mensal (R$)",
        help_text="Valor do aluguel mensal"
    )
    
    bairro = models.CharField(
        max_length=50,
        choices=BAIRROS_CHOICES,
        verbose_name="Bairro"
    )
    
    tipo = models.CharField(
        max_length=20,
        choices=TIPO_CHOICES,
        verbose_name="Tipo de Imóvel"
    )
    
    dono = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='imoveis',
        verbose_name="Proprietário"
    )
    
    telefone_contato = models.CharField(
        max_length=20,
        verbose_name="Telefone/WhatsApp",
        help_text="Formato: (DD) 9XXXX-XXXX"
    )
    
    foto_principal = models.ImageField(
        upload_to='imoveis/',
        verbose_name="Foto Principal",
        help_text="Imagem principal do imóvel"
    )
    
    ativo = models.BooleanField(
        default=True,
        verbose_name="Ativo",
        help_text="Imóvel disponível para aluguel?"
    )
    
    visualizacoes = models.IntegerField(
        default=0,
        verbose_name="Visualizações",
        help_text="Contador de visualizações do imóvel"
    )
    
    criado_em = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Data de Criação"
    )
    
    atualizado_em = models.DateTimeField(
        auto_now=True,
        verbose_name="Última Atualização"
    )
    
    class Meta:
        verbose_name = "Imóvel"
        verbose_name_plural = "Imóveis"
        ordering = ['-criado_em']
    
    def __str__(self):
        return f"{self.titulo} - {self.get_bairro_display()} - R$ {self.preco}"
    
    def get_whatsapp_link(self):
        """
        Retorna o link da API do WhatsApp com mensagem pré-formatada
        """
        # Remove caracteres especiais do telefone (deixa só números)
        telefone_limpo = ''.join(filter(str.isdigit, self.telefone_contato))
        
        # Adiciona código do país (Brasil = 55) se não tiver
        if not telefone_limpo.startswith('55'):
            telefone_limpo = '55' + telefone_limpo
        
        # Mensagem pré-formatada
        mensagem = f"Olá! Vi o imóvel *{self.titulo}* anunciado no CorrenteLar e tenho interesse. Poderia me dar mais informações?"
        
        # Codifica a mensagem para URL
        mensagem_encoded = quote(mensagem)
        
        # Retorna o link da API do WhatsApp
        return f"https://wa.me/{telefone_limpo}?text={mensagem_encoded}"


class ImagemImovel(models.Model):
    """
    Modelo para galeria de imagens adicionais do imóvel
    """
    imovel = models.ForeignKey(
        Imovel,
        on_delete=models.CASCADE,
        related_name='imagens',
        verbose_name="Imóvel"
    )
    
    imagem = models.ImageField(
        upload_to='imoveis/galeria/',
        verbose_name="Imagem"
    )
    
    descricao = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Descrição"
    )
    
    ordem = models.IntegerField(
        default=0,
        verbose_name="Ordem"
    )
    
    class Meta:
        verbose_name = "Imagem do Imóvel"
        verbose_name_plural = "Imagens dos Imóveis"
        ordering = ['ordem']
    
    def __str__(self):
        return f"Imagem de {self.imovel.titulo}"
