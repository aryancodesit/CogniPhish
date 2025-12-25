from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Scenario, UserResponse
import random

class FreshScenarioView(APIView):
    def get(self, request):
        # Identify User (mocked as None for now, or use session key if available)
        # For simplicity in this demo, we'll exclude based on ALL responses if we don't have user auth,
        # but optimally we'd filter by request.user.
        
        # Get IDs of scenarios already responded to
        seen_ids = UserResponse.objects.values_list('scenario_id', flat=True)
        
        # Filter DB
        available = Scenario.objects.exclude(id__in=seen_ids)
        count = available.count()
        
        if count == 0:
            # Fallback: If ran out (or 0 total), either return error or reset
            # For this demo, let's reset (allow repeats if exhausted) to avoid breaking app
            available = Scenario.objects.all()
            count = available.count()
            if count == 0:
                return Response({"error": "No scenarios available. Run generation command."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        random_index = random.randint(0, count - 1)
        scenario = available[random_index]
        
        data = {
            "id": scenario.id,
            "subject": scenario.subject,
            "body_html": scenario.body_html,
            "sender_display": scenario.sender_display,
            "sender_address": scenario.sender_address,
        }
        response = Response(data)
        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        return response

class SubmitResultView(APIView):
    def post(self, request):
        scenario_id = request.data.get('scenario_id')
        user_choice = request.data.get('user_choice') # 'PHISHING' or 'SAFE'
        confidence = int(request.data.get('confidence_level', 0))
        
        scenario = get_object_or_404(Scenario, id=scenario_id)
        
        # Calculate Logic
        # Truth Label: scenario.is_phishing
        # User Choice: PHISHING (True) or SAFE (False)
        
        user_said_phishing = (user_choice == 'PHISHING')
        is_correct = (user_said_phishing == scenario.is_phishing)
        
        risk_score = 0.0
        feedback_header = "Good Job!"
        feedback_message = ""
        
        if is_correct:
            risk_score = 0
            feedback_message = f"You correctly identified this as {'Phishing' if scenario.is_phishing else 'Safe'}."
        else:
            # Wrong! Apply Formula
            # Risk = (Confidence * Impact / Difficulty) * 10
            # Avoid division by zero just in case
            difficulty = max(scenario.difficulty, 1)
            impact = scenario.impact
            
            risk_score = (confidence * impact / difficulty) * 10
            risk_score = round(risk_score, 2)
            
            feedback_header = "You Missed It!"
            if scenario.is_phishing:
                feedback_message = f"You thought this phishing email was Safe. It was a {scenario.difficulty}/10 difficulty attack."
            else:
                feedback_message = f"You thought this safe email was Phishing. False positives disrupt business."

            if confidence > 7 and scenario.difficulty < 4:
                feedback_message += " You were Overconfident on a Low Difficulty email. This is high risk (Dunning-Kruger warning)."

        # Save Response
        UserResponse.objects.create(
            user=request.user if request.user.is_authenticated else None,
            scenario=scenario,
            user_choice=user_choice,
            confidence=confidence,
            risk_score=risk_score
        )
        
        return Response({
            "is_correct": is_correct,
            "risk_score": risk_score,
            "feedback_header": feedback_header,
            "feedback_message": feedback_message,
            "trap_explanation": scenario.trap_explanation,
            "difficulty": scenario.difficulty,
            "impact": scenario.impact
        })

class StatsView(APIView):
    def get(self, request):
        # Get last 10 responses
        responses = UserResponse.objects.all().order_by('-timestamp')[:10]
        data = []
        
        total_risk = 0
        overconfidence_count = 0
        
        for i, r in enumerate(responses):
            correct_choice = 'PHISHING' if r.scenario.is_phishing else 'SAFE'
            is_correct = (r.user_choice == correct_choice)
            
            # Map to 0-100 scale for "Knowledge" graph
            self_estimated = r.confidence * 10
            actual = 100 if is_correct else 0
            
            data.append({
                "scenario": f"#{i+1}", # Simple numerical axis for "Expertise/Time"
                "full_subject": r.scenario.subject,
                "self_estimated": self_estimated, # Red Line
                "actual": actual,                 # Green Line
                "risk_score": r.risk_score
            })
            
            total_risk += r.risk_score
            if not is_correct and r.confidence > 7: 
                overconfidence_count += 1

        # Generate Insight
        if not data:
            insight = "No data yet. Complete some scenarios!"
        elif overconfidence_count >= 3:
            insight = "⚠️ Potential Dunning-Kruger Detected: You frequently exhibit high confidence on incorrect decisions. You may be overestimating your ability to detect traps."
        elif total_risk < 200:
            insight = "✅ Good Awareness: Your risk scores are generally low. You tend to align your confidence well with your actual accuracy."
        else:
            insight = "ℹ️ Mixed Results: Your performance is varied. Try to slow down and verify links before dragging the confidence slider to 10."

        return Response({
            "history": data[::-1], # Reverse to show chronological order for graph
            "insight": insight
        })
