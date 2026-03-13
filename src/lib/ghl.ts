/**
 * GoHighLevel API integration for email campaigns and CRM sync.
 *
 * Docs: https://highlevel.stoplight.io/docs/integrations
 *
 * Set GHL_API_KEY and GHL_LOCATION_ID in .env
 */

const BASE_URL = process.env.GHL_BASE_URL || "https://services.leadconnectorhq.com";
const API_KEY = process.env.GHL_API_KEY || "";
const LOCATION_ID = process.env.GHL_LOCATION_ID || "";

interface GHLRequestOptions {
  method: string;
  path: string;
  body?: Record<string, unknown>;
}

async function ghlFetch<T = unknown>({ method, path, body }: GHLRequestOptions): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Version: "2021-07-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function ghlCreateContact(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}) {
  return ghlFetch({
    method: "POST",
    path: "/contacts/",
    body: {
      locationId: LOCATION_ID,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      tags: data.tags || [],
      customField: data.customFields
        ? Object.entries(data.customFields).map(([key, value]) => ({ key, field_value: value }))
        : [],
    },
  });
}

export async function ghlSearchContacts(query: string) {
  return ghlFetch({
    method: "GET",
    path: `/contacts/?locationId=${LOCATION_ID}&query=${encodeURIComponent(query)}&limit=20`,
  });
}

export async function ghlGetContact(contactId: string) {
  return ghlFetch({
    method: "GET",
    path: `/contacts/${contactId}`,
  });
}

export async function ghlUpdateContact(contactId: string, data: Record<string, unknown>) {
  return ghlFetch({
    method: "PUT",
    path: `/contacts/${contactId}`,
    body: data,
  });
}

export async function ghlAddContactTag(contactId: string, tags: string[]) {
  return ghlFetch({
    method: "POST",
    path: `/contacts/${contactId}/tags`,
    body: { tags },
  });
}

// ─── Email / Campaigns ──────────────────────────────────────────────────────

export async function ghlSendEmail(data: {
  contactId: string;
  subject: string;
  htmlBody: string;
  fromName?: string;
  fromEmail?: string;
}) {
  return ghlFetch({
    method: "POST",
    path: `/conversations/messages`,
    body: {
      type: "Email",
      contactId: data.contactId,
      subject: data.subject,
      html: data.htmlBody,
      emailFrom: data.fromEmail,
      ...(data.fromName && { emailFromName: data.fromName }),
    },
  });
}

export async function ghlTriggerWorkflow(data: {
  contactId: string;
  workflowId: string;
}) {
  return ghlFetch({
    method: "POST",
    path: `/contacts/${data.contactId}/workflow/${data.workflowId}`,
    body: {},
  });
}

// ─── Opportunities / Pipeline ───────────────────────────────────────────────

export async function ghlCreateOpportunity(data: {
  pipelineId: string;
  stageId: string;
  contactId: string;
  title: string;
  monetaryValue?: number;
}) {
  return ghlFetch({
    method: "POST",
    path: `/opportunities/`,
    body: {
      locationId: LOCATION_ID,
      pipelineId: data.pipelineId,
      pipelineStageId: data.stageId,
      contactId: data.contactId,
      name: data.title,
      monetaryValue: data.monetaryValue || 0,
    },
  });
}

// ─── Bulk email via workflow ────────────────────────────────────────────────

/**
 * For bulk campaigns we:
 * 1. Create/upsert contacts in GHL
 * 2. Tag them with the campaign ID
 * 3. Trigger a GHL workflow that sends the email sequence
 *
 * This keeps email delivery, throttling, and compliance in GHL.
 */
export async function ghlLaunchCampaign(campaignData: {
  campaignId: string;
  workflowId: string;
  recipients: Array<{
    email: string;
    firstName?: string;
    lastName?: string;
  }>;
}) {
  const results = [];

  for (const recipient of campaignData.recipients) {
    try {
      // Create or find contact
      const contact = await ghlCreateContact({
        email: recipient.email,
        firstName: recipient.firstName,
        lastName: recipient.lastName,
        tags: [`campaign-${campaignData.campaignId}`, "musicpress-campaign"],
      });

      const contactId = (contact as { contact?: { id?: string } })?.contact?.id;

      if (contactId) {
        // Trigger the workflow for this contact
        await ghlTriggerWorkflow({
          contactId,
          workflowId: campaignData.workflowId,
        });
        results.push({ email: recipient.email, status: "triggered", contactId });
      } else {
        results.push({ email: recipient.email, status: "contact_created_no_id" });
      }
    } catch (error) {
      results.push({
        email: recipient.email,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

export function isGHLConfigured(): boolean {
  return !!(API_KEY && LOCATION_ID);
}
