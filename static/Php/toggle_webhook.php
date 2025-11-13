<?php
$configFile = __DIR__ . '/../json/webhook_config.json';

// reads config 
$config = json_decode(file_get_contents($configFile), true);

// Toggles the value
$config['enabled'] = !$config['enabled'];

// saves
file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT));

// gives new status back
echo json_encode(['enabled' => $config['enabled']]);
?>
