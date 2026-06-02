/**
 * نما للجمال — Sahtk Order Webhook
 * Google Apps Script: Deploy as Web App → Who has access: Anyone
 * انسخ رابط النشر إلى SHEETS_WEBHOOK_URL في الـ backend (بدون كلمة سر)
 */

const SHEET_NAME = "الورقة1";

const HEADERS = [
  "التاريخ",
  "رقم الطلب",
  "الدولة",
  "الاسم",
  "رقم الهاتف",
  "المنتج",
  "رمز المنتج",
  "الكمية",
  "السعر الإجمالي",
  "العملة",
  "الحالة",
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
      order.country || "المملكة العربية السعودية",
      order.customer_name || "",
      order.phone || "",
      order.products_ar || "",
      order.skus || "",
      order.quantities || "",
      order.total_sar != null ? order.total_sar : "",
      order.currency || "ريال سعودي",
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
    sheet.setName(SHEET_NAME);
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
