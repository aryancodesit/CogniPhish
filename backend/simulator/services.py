import json
import random

class ScenarioGenerator:
    """
    Advanced Combinatorial Generator (Agent A).
    Generates millions of unique email variations by mixing and matching components.
    """

    def __init__(self):
        # --- SAFE COMPONENTS ---
        self.safe_senders = [
            ("HR Department", "hr-updates@company-internal.com"),
            ("IT Support", "support@company-internal.com"),
            ("Event Planning", "events@company-internal.com"),
            ("Management", "management@company-internal.com"),
            ("Facilities", "facilities@company-internal.com"),
            ("Internal Comms", "comms@company-internal.com"),
            ("Project Manager", "pm@company-internal.com"),
            ("Finance Team", "finance@company-internal.com"),
        ]
        
        self.safe_subjects = [
            "Project Update: Q4 Goals", "Meeting Reminder: Weekly Sync", "Welcome New Hires",
            "Cafeteria Menu Update", "Office Maintenance Scheduled", "Holiday Party RSVP",
            "New Security Policy", "Expense Report Approved", "Server Downtime Notice",
            "Feedback on Presentation", "Quarterly All-Hands", "Training Session Required",
            "Building Access Update", "Lost and Found Item", "Charity Drive Details"
        ]

        # --- PHISHING COMPONENTS ---
        self.phishing_topics = [
            {
                "subject_templates": ["Urgent: Account Suspended", "Action Required: Verify Identity", "Security Alert: Unusual Login"],
                "body_templates": [
                    "We detected unauthorized access to your account from {location}. Please verify your identity immediately to avoid suspension.",
                    "Your password has expired. You must reset it within 2 hours or your account will be locked.",
                    "We noticed suspicious activity on your {service} account. Confirm this was you."
                ],
                "sender_names": ["Security Team", "Account Support", "Identity Protection", "SysAdmin"],
                "trap_type": "Urgency + Spoofing",
                "domains": ["security-verify.net", "account-update-secure.info", "company-internal-login.com", "goggle-security.com"]
            },
            {
                "subject_templates": ["Payroll Error", "Direct Deposit Failed", "Salary Adjustment", "Bonus Payout"],
                "body_templates": [
                    "We could not process your last paycheck due to a banking error. Update your details below.",
                    "You are eligible for a performance bonus. Login to the portal to claim it.",
                    "There is a discrepancy in your tax filing. Review your document immediately."
                ],
                "sender_names": ["Payroll Admin", "Finance Dept", "HR Benefits"],
                "trap_type": "Financial Bait",
                "domains": ["payrol-service.net", "finance-portal-secure.org", "hr-benefits-claim.com"]
            },
            {
                "subject_templates": ["Document Shared: Q1 Layoffs", "Confidential: Salary Banding", "CEO Shared a File"],
                "body_templates": [
                    "The CEO has shared a confidential document with you: '{doc_name}'. View it securely.",
                    "You have been granted access to the restricted folder: '{doc_name}'.",
                    "Please review the attached contract '{doc_name}' and sign by EOD."
                ],
                "sender_names": ["DocuSign Service", "OneDrive Notifications", "Dropbox Secure"],
                "trap_type": "Curiosity/Fear",
                "domains": ["docusign-secure-view.xyz", "onedrive-shared-files.net", "dropbox-internal.co"]
            },
            {
                "subject_templates": ["Package Delivery Failed", "Missed Delivery Attempt", "Track Your Shipment"],
                "body_templates": [
                    "We tried to deliver your package today but no one was home. Reschedule now.",
                    "Your shipment is on hold due to address verification. Update address.",
                    "Courier was unable to access the building. Call driver or update instructions."
                ],
                "sender_names": ["FedEx Logistics", "UPS Tracking", "DHL Courier"],
                "trap_type": "Generic Service Spoof",
                "domains": ["fedex-tracking-update.info", "ups-delivery-status.net", "dhl-global-mail.com"]
            }
        ]

        # --- COMMON ---
        self.locations = ["Moscow, Russia", "Beijing, China", "Unknown Device", "New York, USA"]
        self.doc_names = ["Layoffs_Plan_Final.pdf", "Salary_Adjustment_2025.docx", "Employee_Bonus_Structure.xlsx"]
        self.greetings = ["Hi Team,", "Dear User,", "Attention:", "Hello,"]

    def _generate_active_html(self, header, body, link_text, link):
        return f"""
            <div style="font-family: 'Arial', sans-serif; color: #202124; line-height: 1.5;">
                <h2 style="color: #202124; margin-bottom: 24px; font-weight: normal; font-size: 20px;">{header}</h2>
                <p style="margin-bottom: 16px;">{random.choice(self.greetings)}</p>
                <p style="margin-bottom: 24px;">{body}</p>
                <p style="margin-bottom: 32px;">
                    <a href="{link}" style="background-color: #1a73e8; color: white; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-weight: 500; display: inline-block;">
                        {link_text}
                    </a>
                </p>
                <p style="color: #5f6368; font-size: 13px;">Thanks,<br>The Management Team</p>
            </div>
            """

    def generate_scenario(self, difficulty=5):
        # Partition Safe/Phishing ~ 30/70
        if random.random() < 0.3:
            return self._generate_safe_email()
        else:
            return self._generate_phishing_email()

    def _generate_safe_email(self):
        # Pick random sender
        sender_display, sender_address = random.choice(self.safe_senders)
        subject = random.choice(self.safe_subjects)
        
        # Add random believable noise to subject
        if random.random() < 0.2: subject = "Fwd: " + subject
        
        body = f"This is an automated notification regarding {subject.lower()}. Please check the internal dashboard for details."
        link_text = "View Dashboard"
        link = "http://internal-portal.company.com/view"
        
        return {
            "scenario_type": "Safe",
            "sender_display": sender_display,
            "sender_address": sender_address,
            "subject": subject,
            "html_body": self._generate_active_html(subject, body, link_text, link),
            "trap_explanation": "Legitimate internal email. Sender and link match internal patterns."
        }

    def _generate_phishing_email(self):
        # Pick a Phishing Category
        category = random.choice(self.phishing_topics)
        
        # Pick Components
        subject = random.choice(category["subject_templates"])
        raw_body = random.choice(category["body_templates"])
        
        # Fill placeholders
        body = raw_body.format(
            location=random.choice(self.locations),
            service="Office 365",
            doc_name=random.choice(self.doc_names)
        )
        
        sender_name = random.choice(category["sender_names"])
        # Create deceptive email: sender + @ + fake_domain
        fake_domain = random.choice(category["domains"])
        # Randomize user part slightly
        user_part = sender_name.lower().replace(" ", ".")
        sender_address = f"{user_part}@{fake_domain}"
        
        link_text = "Verify Now" if "Verify" in subject else "View Document"
        link = f"http://{fake_domain}/auth/login?user=target"

        return {
            "scenario_type": "Phishing",
            "sender_display": sender_name,
            "sender_address": sender_address,
            "subject": subject,
            "html_body": self._generate_active_html(subject, body, link_text, link),
            "trap_explanation": f"{category['trap_type']}: The domain '{fake_domain}' is external and suspicious."
        }

    def analyze_scenario(self, scenario_data):
        is_phishing = (scenario_data["scenario_type"] == "Phishing")
        difficulty = random.randint(4, 9) if is_phishing else 1
        return {
            "difficulty": difficulty,
            "impact": random.randint(3, 5),
            "is_phishing": is_phishing
        }
