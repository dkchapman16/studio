'use server';
/**
 * @fileOverview Manages intelligent notifications, adapting alerts based on quiet hours and driver fatigue.
 *
 * - intelligentNotifications - Main function to manage and send notifications.
 * - IntelligentNotificationsInput - Input type for the intelligentNotifications function.
 * - IntelligentNotificationsOutput - Return type for the intelligentNotifications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentNotificationsInputSchema = z.object({
  loadRef: z.string().describe('Load reference number.'),
  deliveryCity: z.string().describe('Delivery city.'),
  deliveryState: z.string().describe('Delivery state.'),
  apptLocal: z.string().describe('Local appointment time.'),
  etaLocal: z.string().describe('Local estimated time of arrival.'),
  reason: z.string().describe('Reason for the alert.'),
  buffer: z.number().describe('Time buffer in minutes.'),
  ackUrl: z.string().describe('URL to acknowledge the alert.'),
  driverPhone: z.string().describe('Driver phone number.'),
  dispatcherPhone: z.string().describe('Dispatcher phone number.'),
  quietHoursStart: z.number().describe('Start of quiet hours (0-23).'),
  quietHoursEnd: z.number().describe('End of quiet hours (0-23).'),
  allowNightCalls: z.boolean().describe('Whether night calls are allowed.'),
  alertOwnerPhone: z.string().describe('Alert owner phone number for escalations.'),
  currentHour: z.number().describe('Current hour in local time (0-23).'),
  driverName: z.string().describe('Driver name'),
  lastDrivingStart: z.string().optional().describe('ISO timestamp of the last time the driver started driving.'),
  status: z.string().describe('The current status: OK|WATCH|AT_RISK'),
});
export type IntelligentNotificationsInput = z.infer<typeof IntelligentNotificationsInputSchema>;

const IntelligentNotificationsOutputSchema = z.object({
  message: z.string().describe('The content of the notification message.'),
sendSms: z.boolean().describe('A boolean which indicates whether an SMS should be sent'),
sendVoice: z.boolean().describe('A boolean which indicates whether a voice call should be sent'),
  escalateToOwner: z.boolean().describe('A boolean which indicates whether the alert should be escalated to the owner.'),
});
export type IntelligentNotificationsOutput = z.infer<typeof IntelligentNotificationsOutputSchema>;

export async function intelligentNotifications(input: IntelligentNotificationsInput): Promise<IntelligentNotificationsOutput> {
  return intelligentNotificationsFlow(input);
}

const notificationPrompt = ai.definePrompt({
  name: 'notificationPrompt',
  input: { schema: IntelligentNotificationsInputSchema },
  output: { schema: IntelligentNotificationsOutputSchema },
  prompt: `You are an intelligent notification system for a logistics company. Your goal is to create and send appropriate messages to drivers and dispatchers based on the time of day, driver status, and company policies regarding quiet hours.

Here's the information you have:
- Load Reference: {{{loadRef}}}
- Delivery City: {{{deliveryCity}}}
- Delivery State: {{{deliveryState}}}
- Appointment Time (Local): {{{apptLocal}}}
- Estimated Time of Arrival (Local): {{{etaLocal}}}
- Reason for Alert: {{{reason}}}
- Time Buffer: {{{buffer}}} minutes
- Acknowledge URL: {{{ackUrl}}}
- Current Hour (Local): {{{currentHour}}}
- Quiet Hours Start: {{{quietHoursStart}}}
- Quiet Hours End: {{{quietHoursEnd}}}
- Allow Night Calls: {{{allowNightCalls}}}
- Driver Name: {{{driverName}}}
- Last Driving Start: {{{lastDrivingStart}}}
- Status: {{{status}}}

Quiet Hours:
Quiet hours are from {{{quietHoursStart}}}:00 to {{{quietHoursEnd}}}:00 local time. During quiet hours, voice calls are generally not allowed unless allowNightCalls is true.

Driver Fatigue Considerations:
If the driver has been driving for a long time (e.g., more than 8 hours) or if it is late at night (e.g., after 1 AM), adjust the message to focus on safety and support. Prioritize driver well-being in the message.

INSTRUCTIONS:
Based on all of this information, return a JSON object indicating:
1. The message to send to the driver and dispatcher (message field).
2. Whether to send an SMS (sendSms field, true or false).
3. Whether to make a voice call (sendVoice field, true or false).
4. Whether to escalate the alert to the owner (escalateToOwner field, true or false). Escalate if it's AT_RISK and wasn't acknowledged, quiet hours are active and calls aren't allowed.

Considerations for generating messages:
- The message should be concise and informative.
- Focus on safety if driver may be fatigued (is late at night or has been driving for a long time).
- Make sure the message is relevant to the alert status.


Example:
{
  "message": "ETA Risk: AT_RISK. Load ABC123 to Anytown, CA. Appt: 14:00. ETA: 14:30. Reason: Traffic delay. Acknowledge: example.com/ack",
  "sendSms": true,
  "sendVoice": false,
  "escalateToOwner": true
}

Make sure the JSON is valid and complete. Do not miss any fields. Do not include explanations in the response - only the JSON.
`,
});

const intelligentNotificationsFlow = ai.defineFlow(
  {
    name: 'intelligentNotificationsFlow',
    inputSchema: IntelligentNotificationsInputSchema,
    outputSchema: IntelligentNotificationsOutputSchema,
  },
  async input => {
    const { currentHour, quietHoursStart, quietHoursEnd, allowNightCalls, status } = input;

    const isQuietHours = currentHour >= quietHoursStart || currentHour < quietHoursEnd;
    const voiceCallAllowed = !isQuietHours || allowNightCalls;

    const { output } = await notificationPrompt(input);

 if (!output) {
      throw new Error('No output from notification prompt');
    }

    const escalateToOwner = isQuietHours && !voiceCallAllowed && status === 'AT_RISK';

    return {
      ...output,
 sendSms: output.sendSms,
 sendVoice: voiceCallAllowed && output.sendVoice, // Respect quiet hours
      escalateToOwner: escalateToOwner,
    };
  }
);
