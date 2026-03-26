<?php
require_once __DIR__ . '/public/api/config.php';
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->query("SELECT id, user_id, court_id, booking_date, status, transaction_ref, created_at FROM bookings ORDER BY id DESC LIMIT 10");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    header("Content-Type: application/json");
    echo json_encode($rows, JSON_PRETTY_PRINT);
} catch(Exception $e) {
    echo $e->getMessage();
}
