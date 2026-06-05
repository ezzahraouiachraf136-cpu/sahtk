/**
 * Nama Store — Order Webhook
 * Deploy: Web app → Execute as Me → Who has access: Anyone
 * Paste deploy URL into backend SHEETS_WEBHOOK_URL (no secret)
 */

const SHEET_NAME = "Sheet1";

const HEADERS = [
  "date",
  "orders",
  "country",
  "name",
  "phons",
  "product",
  "sku",
  "quantity",
  "total price",
  "currency",
  "status",
];

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    var order = body.order;
    if (!order || !order.order_number) {
      return jsonResponse({ ok: false, error: "missing order" }, 400);
    }

    var sheet = getOrCreateSheet();
    var row = [
      order.date || "",
      order.order_number || "",
      order.country || "KSA",
      order.customer_name || "",
      order.phone || "",
      order.products_ar || "",
      order.skus || "",
      order.quantities || "",
      order.total_sar != null ? order.total_sar : "",
      order.currency || "SAR",
      order.status != null ? order.status : "",
    ];

    var existingRow = findRowByOrderNumber(sheet, order.order_number);
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return jsonResponse({ ok: true, order_number: order.order_number });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: "nama-orders-webhook",
    columns: HEADERS,
  });
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0] || ss.insertSheet(SHEET_NAME);
    if (sheet.getName() !== SHEET_NAME) {
      sheet.setName(SHEET_NAME);
    }
  }
  ensureHeaders(sheet);
  return sheet;
}

function ensureHeaders(sheet) {
  var firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var needsHeaders = firstRow.join("").trim() === "";
  if (needsHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function findRowByOrderNumber(sheet, orderNumber) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === orderNumber) return i + 1;
  }
  return -1;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
