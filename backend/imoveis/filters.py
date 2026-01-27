import django_filters
from .models import Imovel


class ImovelFilter(django_filters.FilterSet):
    """
    Filtros para busca de imóveis
    """
    preco_min = django_filters.NumberFilter(field_name='preco', lookup_expr='gte', label='Preço Mínimo')
    preco_max = django_filters.NumberFilter(field_name='preco', lookup_expr='lte', label='Preço Máximo')
    
    class Meta:
        model = Imovel
        fields = {
            'bairro': ['exact'],
            'tipo': ['exact'],
        }
