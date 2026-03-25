<?php
// API Entry Point for Tennis Court Booking Platform
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit;
}

// Load shared config if available (production), else use inline fallback
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
    $host     = DB_HOST; 
    $db_name  = DB_NAME;
    $username = DB_USER;
    $password = DB_PASS;
} else {
    $host = 'localhost'; $db_name = 'scaleupc_court';
    $username = 'scaleupc_court'; $password = 'ZmcpPgKGccdxtefU5MtD';
}

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8mb4");
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection failed: " . $exception->getMessage()]);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($action) {
    case 'login':
        $data = json_decode(file_get_contents("php://input"));
        $stmt = $conn->prepare("SELECT * FROM users WHERE phone = ?");
        $stmt->execute([$data->phone]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user ?: ["isRegistered" => false]);
        break;

    case 'register':
        $data = json_decode(file_get_contents("php://input"));
        $stmt = $conn->prepare("INSERT INTO users (phone, name, nickname, email, birthday) VALUES (?, ?, ?, ?, ?)");
        if($stmt->execute([$data->phone, $data->name, $data->nickname, $data->email, $data->birthday])) {
            $data->id = $conn->lastInsertId();
            echo json_encode($data);
        } else {
            echo json_encode(["error" => "Registration failed"]);
        }
        break;

    case 'courts':
        $stmt = $conn->query("SELECT * FROM courts WHERE is_active = 1");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'get_all_status':
        $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
        $stmt = $conn->prepare("SELECT * FROM allotments WHERE date = ?");
        $stmt->execute([$date]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'check_payment_status':
        // Called by frontend every 3s to detect when webhook has confirmed payment
        $bookingId = $_GET['booking_id'] ?? null;
        if (!$bookingId) { echo json_encode(["error" => "Missing booking_id"]); break; }
        $stmt = $conn->prepare("SELECT status, transaction_ref FROM bookings WHERE id = ?");
        $stmt->execute([$bookingId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($row ?: ["status" => "Pending"]);
        break;

    case 'toggle_allotment':
        $data = json_decode(file_get_contents("php://input"));
        $stmt = $conn->prepare("SELECT id FROM allotments WHERE court_id = ? AND date = ? AND hour = ?");
        $stmt->execute([$data->court_id, $data->date, $data->hour]);
        $existing = $stmt->fetch();
        if ($existing) {
            $conn->prepare("UPDATE allotments SET is_open = NOT is_open WHERE id = ?")->execute([$existing['id']]);
        } else {
            $conn->prepare("INSERT INTO allotments (court_id, date, hour, is_open) VALUES (?, ?, ?, 0)")->execute([$data->court_id, $data->date, $data->hour]);
        }
        echo json_encode(["success" => true]);
        break;

    case 'set_pending':
        $data = json_decode(file_get_contents("php://input"));
        $stmt = $conn->prepare("INSERT INTO allotments (court_id, date, hour, pending_by) VALUES (?, ?, ?, ?) 
                               ON DUPLICATE KEY UPDATE pending_by = VALUES(pending_by)");
        $stmt->execute([$data->court_id, $data->date, $data->hour, $data->name]);
        echo json_encode(["success" => true]);
        break;

    case 'clear_pending':
        $data = json_decode(file_get_contents("php://input"));
        $conn->prepare("UPDATE allotments SET pending_by = NULL WHERE court_id = ? AND date = ? AND hour = ?")
             ->execute([$data->court_id, $data->date, $data->hour]);
        echo json_encode(["success" => true]);
        break;

    case 'confirm_booking':
        $data = json_decode(file_get_contents("php://input"));
        $conn->prepare("UPDATE allotments SET booked_by = pending_by, pending_by = NULL WHERE court_id = ? AND date = ? AND hour = ?")
             ->execute([$data->court_id, $data->date, $data->hour]);
        $stmt = $conn->prepare("INSERT INTO bookings (user_id, court_id, booking_date, booking_time, price) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data->user_id, $data->court_id, $data->date, $data->hour, $data->price]);
        echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
        break;

    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}
?>
