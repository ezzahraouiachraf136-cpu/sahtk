/**
 * نما للجمال — Sahtk Order Webhook
 * Google Apps Script: Deploy as Web App (Anyone)
 * Set SHEETS_WEBHOOK_SECRET in Script Properties + match backend env
 */

const SHEET_NAME = "الطلبات";
const SECRET_PROPERTY = "WEBHOOK_SECRET";

function doPost(e) {
  try {
    const secret = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
    const headerSecret =
      (e && e.parameter && e.parameter.secret) ||
      (e && e.headers && (e.headers["X-Webhook-Secret"] || e.headers["x-webhook-secret"]));

    let body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    const payloadSecret = body.secret || headerSecret;
    if (secret && payloadSecret !== secret) {
      return jsonResponse({ ok: false, error: "unauthorized" }, 401);
    }

    const order = body.order;
    if (!order || !order.id) {
      return jsonResponse({ ok: false, error: "missing order" }, 400);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "timestamp",
        "order_id",
        "order_number",
        "customer_name",
        "phone",
        "items_json",
        "subtotal_sar",
        "total_sar",
        "status",
        "upsell_accepted",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "source_url",
      ]);
    }

    const existingRow = findRowByOrderId(sheet, order.id);
    const row = [
      new Date().toISOString(),
      order.id,
      order.order_number || "",
      order.customer_name || "",
      order.phone || "",
      JSON.stringify(order.items || []),
      order.subtotal_sar || 0,
      order.total_sar || 0,
      order.status || "pending_confirmation",
      order.upsell_accepted === true,
      order.utm_source || "",
      order.utm_medium || "",
      order.utm_campaign || "",
      order.utm_content || "",
      order.source_url || "",
    ];

    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return jsonResponse({ ok: true, order_id: order.id });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function doGet() {
  return jsonResponse({ ok: true, service: "nama-orders-webhook" });
}

function findRowByOrderId(sheet, orderId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === orderId) return i + 1;
  }
  return -1;
}

function jsonResponse(obj, code) {
  const output = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
  // Apps Script Web App لا يدعم code HTTP مخصص بسهولة — يكفي body
  return output;
}

/**
 * تشغيل مرة واحدة من المحرر لتعيين السر:
 * setWebhookSecret("your-secret-here");
 */
function setWebhookSecret(value) {
  PropertiesService.getScriptProperties().setProperty(SECRET_PROPERTY, value);
}
