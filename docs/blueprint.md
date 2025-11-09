# **App Name**: Hitched Alert

## Core Features:

- Datatruck Load Sync: Fetch and sync active loads from the Datatruck API into Firestore, normalizing the data.
- ETA Evaluation: Compute ETA using Motive GPS data and Google Maps Distance Matrix, tiered for cost-efficiency.
- Risk Classification: Classify loads as OK, WATCH, or AT_RISK based on ETA compared to appointment time and configurable buffers.
- Alerting and Escalation: Send SMS and voice call alerts via Twilio for WATCH and AT_RISK loads, with escalation to owner if unacknowledged.
- Acknowledgment Handling: Process acknowledgments via SMS or voice call, updating Firestore records.
- Quiet Hours Management: Enforce quiet hours (local time) to suppress voice calls, with SMS-only alerts and owner escalation if needed. A tool which makes an intelligent decision based on configurable rules to adapt the kind of notification to the time of day.
- Dynamic Route Adjustment: Allow dispatcher to view map routes, with insight to alter the suggested routes of the drivers, and relay that new instruction information through a notification service.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) evoking reliability and trust.
- Background color: Light gray (#F5F5F5), provides a clean and professional backdrop.
- Accent color: Bright orange (#FF9800) for alerts and important actions, attracting attention.
- Headline font: 'Poppins', a geometric sans-serif font for headlines and important labels to maintain a modern, precise look.
- Body font: 'Inter', a grotesque-style sans-serif for body text for its neutral and readable qualities. 'Poppins' is not appropriate for long form body.
- Use simple, clear icons representing load status, ETAs, and alerts.
- Layout: Clean, card-based design for loads, using visual hierarchy to highlight key information.
- Subtle animations to indicate status changes or new alerts, avoiding unnecessary distractions.