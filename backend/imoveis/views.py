from django.shortcuts import redirect

# Redirecionar tudo para o frontend React
def redirect_to_react(request):
    """Redireciona para o frontend React em localhost:5173"""
    return redirect('http://localhost:5173')
