<?php
/**
 * Omise Charge Creator
 * Creates PromptPay / Alipay / WeChat Pay charges via Omise API
 * 
 * POST params: { court_id, booking_id, amount, type, customer_name, phone, date, hour }
 * Returns: { charge_id, qr_code_uri, authorize_uri }
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/config.php';  // Contains OMISE_SECRET_KEY, DB creds
require_once __DIR__ . '/sms.php';

$data = json_decode(file_get_contents('php://input'), true);

$type       = $data['type']       ?? 'promptpay'; // promptpay | alipay | wechat_pay
$amount     = $data['amount']     ?? 50000;        // in satangs (500 THB = 50000)
$booking_id = $data['booking_id'] ?? null;
$court_id   = $data['court_id']   ?? null;
$date       = $data['date']       ?? date('Y-m-d');
$hour       = $data['hour']       ?? '00:00';

if (!$booking_id || !$court_id) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// ---- DB connection ----
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8mb4");
} catch(PDOException $e) {
    echo json_encode(['error' => 'DB: ' . $e->getMessage()]); exit;
}

// ---- Omise API: Create Source ----
$sourcePayload = ['type' => $type, 'amount' => (int)$amount, 'currency' => 'thb'];
$ch = curl_init('https://api.omise.co/sources');
curl_setopt_array($ch, [
    CURLOPT_POST           => 1,
    CURLOPT_USERPWD        => OMISE_PUBLIC_KEY . ':',
    CURLOPT_POSTFIELDS     => json_encode($sourcePayload),
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
]);
$sourceRes = json_decode(curl_exec($ch), true);
curl_close($ch);

if (isset($sourceRes['code'])) {
    echo json_encode(['error' => 'Omise Source: ' . $sourceRes['message']]);
    exit;
}
$sourceId = $sourceRes['id'];

// ---- Omise API: Create Charge ----
$chargePayload = [
    'amount'               => (int)$amount,
    'currency'             => 'thb',
    'source'               => $sourceId,
    'return_uri'           => SITE_URL . '/payment-return',
    'webhook_endpoints'    => [SITE_URL . '/api/webhook.php'],
    'metadata'             => [
        'booking_id' => $booking_id,
        'court_id'   => $court_id,
        'date'       => $date,
        'hour'       => $hour,
    ],
];
$ch = curl_init('https://api.omise.co/charges');
curl_setopt_array($ch, [
    CURLOPT_POST           => 1,
    CURLOPT_USERPWD        => OMISE_SECRET_KEY . ':',
    CURLOPT_POSTFIELDS     => json_encode($chargePayload),
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
]);
$chargeRes = json_decode(curl_exec($ch), true);
curl_close($ch);

if (isset($chargeRes['code'])) {
    echo json_encode(['error' => 'Omise Charge: ' . $chargeRes['message']]);
    exit;
}

// Save charge ID to DB
$stmt = $conn->prepare("UPDATE bookings SET payment_provider='omise', transaction_ref=?, status='Pending' WHERE id=?");
$stmt->execute([$chargeRes['id'], $booking_id]);

echo json_encode([
    'success'       => true,
    'charge_id'     => $chargeRes['id'],
    'qr_code_uri'   => $chargeRes['source']['scannable_code']['image']['download_uri'] ?? null,
    'authorize_uri' => $chargeRes['authorize_uri'] ?? null,
    'payment_type'  => $type,
]);
