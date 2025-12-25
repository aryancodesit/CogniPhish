from django.urls import path
from .views import FreshScenarioView, SubmitResultView, StatsView

urlpatterns = [
    path('scenario/fresh/', FreshScenarioView.as_view(), name='fresh-scenario'),
    path('submit/', SubmitResultView.as_view(), name='submit-result'),
    path('stats/', StatsView.as_view(), name='stats'),
]
