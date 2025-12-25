from django.core.management.base import BaseCommand
from simulator.services import ScenarioGenerator
from simulator.models import Scenario

class Command(BaseCommand):
    help = 'Generates phishing scenarios using the AI pipeline'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=5, help='Number of scenarios to generate')

    def handle(self, *args, **options):
        count = options['count']
        generator = ScenarioGenerator()
        
        self.stdout.write(f"Starting generation of {count} scenarios...")
        
        for i in range(count):
            try:
                # 1. Agent A: Generate
                raw_scenario = generator.generate_scenario()
                
                # 2. Agent B: Analyze
                analysis = generator.analyze_scenario(raw_scenario)
                
                # 3. Store
                scenario = Scenario.objects.create(
                    scenario_type=raw_scenario.get('scenario_type'),
                    sender_display=raw_scenario.get('sender_display'),
                    sender_address=raw_scenario.get('sender_address'),
                    subject=raw_scenario.get('subject'),
                    body_html=raw_scenario.get('html_body'),
                    trap_explanation=raw_scenario.get('trap_explanation'),
                    difficulty=analysis.get('difficulty'),
                    impact=analysis.get('impact'),
                    is_phishing=analysis.get('is_phishing')
                )
                self.stdout.write(self.style.SUCCESS(f"Created Scenario: {scenario}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error generating scenario: {e}"))
