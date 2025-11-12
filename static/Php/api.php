<?php
// Discord webhook URL
$webhookUrl = "https://canary.discord.com/api/webhooks/1433427430445682688/sdizPzVEYSED3CySehUamhvkVwwyZvhrS8vnNkx_AeZsWwzXHygiELTHxY0PVq04L45h";

// Database connectie
$host = "localhost";
$db   = "apitest";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connectie mislukt: " . $e->getMessage());
}

// Tabel naam
$table = "counters";

// Check of dit een POST request is om een teller te verhogen
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $lang = $input['language'] ?? '';

    if (in_array($lang, ['NL','EN','DE'])) {
        // Verhoog teller in database
        $stmt = $pdo->prepare("UPDATE $table SET $lang = $lang + 1");
        $stmt->execute();

        // Haal nieuwe waarde van alle tellers op
        $stmt = $pdo->query("SELECT NL, EN, DE FROM $table LIMIT 1");
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // Maak de Discord message
        $message = "**Teller Update:**\n"
                 . "🇳🇱 Nederlands: " . $data['NL'] . "\n"
                 . "🇬🇧 Engels: " . $data['EN'] . "\n"
                 . "🇩🇪 Duits: " . $data['DE'];

        // JSON payload voor Discord
        $payload = json_encode([
            "content" => $message
        ]);

        // Verstuur naar Discord webhook
        $ch = curl_init($webhookUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);

        // Stuur tellerdata terug naar JS
        echo json_encode($data);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldige taal']);
    }
    exit;
}

// Voor GET request: haal alle tellers op en stuur naar JS
$stmt = $pdo->query("SELECT NL, EN, DE FROM $table LIMIT 1");
$data = $stmt->fetch(PDO::FETCH_ASSOC);

// Stuur tellerdata terug
echo json_encode($data);
?>
