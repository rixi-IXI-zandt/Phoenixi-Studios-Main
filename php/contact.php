<?php
/**
 * Phoenixi Studios - Contact Handler
 */
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Response placeholder for contact handling
    echo json_encode([
        'status' => 'success',
        'message' => 'Phoenixi Studios contact endpoint active.'
    ]);
    exit;
}

echo json_encode([
    'status' => 'ok',
    'endpoint' => 'contact.php'
]);
