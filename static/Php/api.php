<?php
// --- CONFIGURATIE ---
$webhookUrl = "https://canary.discord.com/api/webhooks/1433427430445682688/sdizPzVEYSED3CySehUamhvkVwwyZvhrS8vnNkx_AeZsWwzXHygiELTHxY0PVq04L45h";
$host = "localhost";
$db   = "apitest";
$user = "root";
$pass = "";
$table = "counters";

// --- DATABASE VERBINDING ---
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Database connectie mislukt: " . $e->getMessage()]));
}

// --- WEBHOOK CONFIG LADEN ---
$configFile = __DIR__ . '/../json/webhook_config.json';
if (!file_exists($configFile)) {
    file_put_contents($configFile, json_encode(["enabled" => true], JSON_PRETTY_PRINT));
}
$config = json_decode(file_get_contents($configFile), true);
$webhookEnabled = $config['enabled'] ?? true;

// --- POST: teller verhogen ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $lang = $input['language'] ?? '';

    if (!in_array($lang, ['NL', 'EN', 'DE'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldige taal']);
        exit;
    }

    try {
        // Verhoog teller in database
        $stmt = $pdo->prepare("UPDATE $table SET $lang = $lang + 1");
        $stmt->execute();

        // Nieuwe waardes ophalen
        $stmt = $pdo->query("SELECT NL, EN, DE FROM $table LIMIT 1");
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // ✅ Alleen alle tellers sturen naar Discord
        if ($webhookEnabled) {
            $flags = [
                'NL' => '🇳🇱',
                'EN' => '🇬🇧',
                'DE' => '🇩🇪'
            ];

            $message = "**Teller Update:**\n"
                     . $flags['NL'] . " Nederlands: " . $data['NL'] . "\n"
                     . $flags['EN'] . " Engels: " . $data['EN'] . "\n"
                     . $flags['DE'] . " Duits: " . $data['DE'];

            $payload = json_encode(["content" => $message]);
            $ch = curl_init($webhookUrl);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_exec($ch);
            curl_close($ch);
        }

        // Stuur tellerdata terug naar JS
        echo json_encode($data);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Databasefout: ' . $e->getMessage()]);
        exit;
    }
}

// --- GET: alle tellers ophalen ---
try {
    $stmt = $pdo->query("SELECT NL, EN, DE FROM $table LIMIT 1");
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($data);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Databasefout: ' . $e->getMessage()]);
}
?>
