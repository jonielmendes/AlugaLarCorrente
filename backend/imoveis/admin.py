from django.contrib import admin
from django.utils.html import format_html
from .models import Imovel, ImagemImovel, Perfil


class ImagemImovelInline(admin.TabularInline):
    """Inline para gerenciar imagens adicionais do imóvel"""
    model = ImagemImovel
    extra = 3
    fields = ('imagem', 'descricao', 'ordem')


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    """Configuração do admin para Perfil de Usuário"""
    list_display = ['user', 'tipo', 'telefone']
    list_filter = ['tipo']
    search_fields = ['user__username', 'user__email', 'telefone']


@admin.register(ImagemImovel)
class ImagemImovelAdmin(admin.ModelAdmin):
    """Configuração do admin para Imagens dos Imóveis"""
    list_display = ['imovel', 'descricao', 'ordem']
    list_filter = ['imovel']


@admin.register(Imovel)
class ImovelAdmin(admin.ModelAdmin):
    """
    Configuração profissional do admin para o modelo Imovel
    """
    
    inlines = [ImagemImovelInline]
    
    # Campos exibidos na lista
    list_display = [
        'titulo',
        'preco_formatado',
        'bairro_display',
        'tipo_display',
        'dono',
        'visualizacoes',
        'ativo_status',
        'criado_em'
    ]
    
    # Filtros laterais
    list_filter = [
        'ativo',
        'bairro',
        'tipo',
        'criado_em',
    ]
    
    # Campos de busca
    search_fields = [
        'titulo',
        'descricao',
        'dono__username',
        'dono__email',
        'telefone_contato'
    ]
    
    # Ordenação padrão
    ordering = ['-criado_em']
    
    # Campos somente leitura
    readonly_fields = [
        'criado_em',
        'atualizado_em',
        'visualizar_foto',
        'link_whatsapp'
    ]
    
    # Organização dos campos no formulário
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'descricao', 'tipo', 'bairro')
        }),
        ('Valores e Contato', {
            'fields': ('preco', 'telefone_contato', 'link_whatsapp')
        }),
        ('Proprietário e Status', {
            'fields': ('dono', 'ativo')
        }),
        ('Mídia', {
            'fields': ('foto_principal', 'visualizar_foto')
        }),
        ('Informações do Sistema', {
            'fields': ('criado_em', 'atualizado_em'),
            'classes': ('collapse',)
        }),
    )
    
    # Filtros de data
    date_hierarchy = 'criado_em'
    
    # Quantidade de itens por página
    list_per_page = 20
    
    # Ações em massa
    actions = ['ativar_imoveis', 'desativar_imoveis']
    
    # Métodos personalizados para exibição
    
    @admin.display(description='Preço', ordering='preco')
    def preco_formatado(self, obj):
        """Formata o preço com símbolo R$"""
        return format_html(
            '<strong style="color: #28a745;">R$ {}</strong>',
            f'{obj.preco:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
        )
    
    @admin.display(description='Bairro', ordering='bairro')
    def bairro_display(self, obj):
        """Exibe o bairro de forma amigável"""
        return obj.get_bairro_display()
    
    @admin.display(description='Tipo', ordering='tipo')
    def tipo_display(self, obj):
        """Exibe o tipo de imóvel de forma amigável"""
        return obj.get_tipo_display()
    
    @admin.display(description='Status', boolean=True)
    def ativo_status(self, obj):
        """Exibe o status como ícone boolean"""
        return obj.ativo
    
    @admin.display(description='Visualizar Foto')
    def visualizar_foto(self, obj):
        """Exibe a foto no formulário de edição"""
        if obj.foto_principal:
            return format_html(
                '<img src="{}" style="max-width: 300px; max-height: 300px; border-radius: 8px;" />',
                obj.foto_principal.url
            )
        return "Sem foto"
    
    @admin.display(description='Link WhatsApp')
    def link_whatsapp(self, obj):
        """Exibe link clicável para WhatsApp"""
        if obj.telefone_contato:
            return format_html(
                '<a href="{}" target="_blank" style="background-color: #25D366; color: white; padding: 8px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">📱 Abrir WhatsApp</a>',
                obj.get_whatsapp_link()
            )
        return "Sem telefone cadastrado"
    
    # Ações personalizadas
    
    @admin.action(description='✅ Ativar imóveis selecionados')
    def ativar_imoveis(self, request, queryset):
        """Ativa os imóveis selecionados"""
        updated = queryset.update(ativo=True)
        self.message_user(request, f'{updated} imóvel(is) ativado(s) com sucesso!')
    
    @admin.action(description='❌ Desativar imóveis selecionados')
    def desativar_imoveis(self, request, queryset):
        """Desativa os imóveis selecionados"""
        updated = queryset.update(ativo=False)
        self.message_user(request, f'{updated} imóvel(is) desativado(s) com sucesso!')
