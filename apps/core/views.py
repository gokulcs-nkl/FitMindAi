"""
FitMind AI Core Views
"""
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


def index(request):
    """
    Serve the main SPA (Single Page Application) index.html
    """
    return render(request, 'index.html')


@require_http_methods(["GET"])
def health_check(request):
    """
    Simple health check endpoint for monitoring
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'FitMind AI backend is running',
        'debug': True
    })
