<?php

require_once 'conn.php';

function database_query(string $query): mysqli_result|bool {
	global $database;
	return $database->query($query);
}

function response(array $payload){
    header("Content-Type: application/json");
    echo json_encode($payload);
    exit();
}

function user_exists(string $username): bool {
    return (bool) database_query("SELECT 1 FROM users WHERE username = '$username'")->num_rows;
}

function admin_exists(string $login): bool {
    return (bool) database_query("SELECT 1 FROM admin WHERE login = '$login'")->num_rows;
}

function generate_token(): string {
    $token = bin2hex(random_bytes(16));
    while((bool) database_query("SELECT 1 FROM sessions WHERE id = '$token'")->num_rows){
        $token = bin2hex(random_bytes(16));
    }
    return $token;
}

function generate_admin_token(): string {
    $token = bin2hex(random_bytes(16));
    while((bool) database_query("SELECT 1 FROM admin_sessions WHERE id = '$token'")->num_rows){
        $token = bin2hex(random_bytes(16));
    }
    return $token;
}
?>