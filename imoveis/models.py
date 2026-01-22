from django.db import models
from django.contrib.auth.models import User
from urllib.parse import quote


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
