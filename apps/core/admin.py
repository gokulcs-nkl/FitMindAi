"""
Django admin configuration for FitMind AI
"""
from django.contrib import admin
from .models import UserProfile, DailyLog


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'age', 'goal', 'activity_level', 'created_at']
    list_filter = ['goal', 'activity_level', 'fitness_level']
    search_fields = ['name', 'college']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ['profile', 'date', 'calories_consumed', 'weight']
    list_filter = ['date', 'profile']
    search_fields = ['profile__name']
    readonly_fields = ['created_at', 'updated_at']
