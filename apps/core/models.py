"""
Core Django models for FitMind AI
"""
from django.db import models


class UserProfile(models.Model):
    """User profile for storing FitMind AI user data"""
    GOAL_CHOICES = [
        ('gain', 'Muscle Gain'),
        ('lose', 'Fat Loss'),
        ('maintain', 'Maintain'),
    ]
    
    ACTIVITY_CHOICES = [
        ('sedentary', 'Sedentary'),
        ('light', 'Light'),
        ('moderate', 'Moderate'),
        ('active', 'Active'),
        ('very_active', 'Very Active'),
    ]
    
    FITNESS_LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    weight = models.FloatField()  # in kg
    height = models.FloatField()  # in cm
    target_weight = models.FloatField()  # in kg
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES)
    activity_level = models.CharField(max_length=15, choices=ACTIVITY_CHOICES)
    fitness_level = models.CharField(max_length=15, choices=FITNESS_LEVEL_CHOICES)
    region = models.CharField(max_length=20)
    budget = models.IntegerField()  # Weekly food budget in Rupees
    environment = models.CharField(max_length=20)  # hostel, home, gym
    college = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.goal}"


class DailyLog(models.Model):
    """Daily nutrition and workout logs"""
    profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    calories_consumed = models.IntegerField(default=0)
    protein = models.FloatField(default=0)
    carbs = models.FloatField(default=0)
    fats = models.FloatField(default=0)
    water_intake = models.IntegerField(default=0)  # in ml
    weight = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.profile.name} - {self.date}"
