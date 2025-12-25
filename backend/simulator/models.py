from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Scenario(models.Model):
    subject = models.CharField(max_length=255)
    body_html = models.TextField()
    difficulty = models.IntegerField(help_text="1-10")
    impact = models.IntegerField(help_text="1-5")
    is_phishing = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    trap_explanation = models.TextField(blank=True, null=True)
    sender_display = models.CharField(max_length=255, blank=True, null=True)
    sender_address = models.CharField(max_length=255, blank=True, null=True)
    scenario_type = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.subject} (Diff: {self.difficulty})"

class UserResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True) # Allow null for now if no auth
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    user_choice = models.CharField(max_length=10, choices=[('PHISHING', 'Phishing'), ('SAFE', 'Safe')])
    confidence = models.IntegerField()
    risk_score = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to {self.scenario.id} - Score: {self.risk_score}"
