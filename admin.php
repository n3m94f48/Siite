<?php
require_once 'conn.php';
require_once 'function.php';
require_once 'errors.php';



if(!isset($_SERVER['PATH_INFO'])) exit();

$content_type = $_SERVER['CONTENT_TYPE'] ?: 'application/json';

switch($content_type){
    case 'application/json':
        $_POST = json_decode(file_get_contents('php://input'), true);
        break;
}

$method = strtolower(substr($_SERVER['PATH_INFO'], 1));

if($method != 'signup' AND $method != 'signin'){
    $session = $_POST['session_id'] ?? error_exit('UNAUTHENTICATED');
    $check = (bool) $database->query(
        "SELECT 1 FROM admin_sessions WHERE id = '$session'"
    )->num_rows;

    if(!$check) error_exit('SESSION_INVALID');
}

switch($method){ 
    case 'signin':
        $login = $_POST['login'] ?? error_exit('BAD_REQUEST', $_POST);
        $password = $_POST['password'] ?? error_exit('BAD_REQUEST', $_POST);

        if(!admin_exists($login)) error_exit('INVALID_CREDENTIALS');

        [$id, $password] = $database->query("SELECT id, password FROM admin WHERE login = '$login'")->fetch_array();

        if($password != $password) error_exit('INVALID_CREDENTIALS');

        $token = generate_token();
        $now = time();

        $database->query("INSERT INTO admin_sessions VALUES ('$token', $id, $now)");

        response([
            'session_id' => $token
        ]);
        break;

    case 'getusers':
        response($database->query("SELECT id, username, about, funds FROM users")->fetch_all(MYSQLI_ASSOC));
        break;

    case 'deleteuser':
        $user_id = $_POST['user_id'] ?? error_exit('BAD_REQUEST', $_POST);

        $database->query("DELETE FROM users WHERE id = $user_id");
        break;

    case 'setuserfunds':
        $user_id = $_POST['user_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $funds = $_POST['funds'] ?? error_exit('BAD_REQUEST', $_POST);

        $database->query("UPDATE users SET funds = '$funds' WHERE id = $user_id");
        break;
    
    case 'getitems':
        response($database->query("SELECT * FROM items")->fetch_all(MYSQLI_ASSOC));
        break;

    case 'getitemcategories':
        response($database->query("SELECT * FROM item_categories")->fetch_all(MYSQLI_ASSOC));
        break;

    case 'newitem':
        $name = $_POST['name'] ?? error_exit('BAD_REQUEST', $_POST);
        $image = $_FILES['image'] ?? error_exit('BAD_REQUEST', 'image missing');
        $price = $_POST['price'] ?? error_exit('BAD_REQUEST', $_POST);
        $category_id = $_POST['category_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $description = $_POST['description'] ?? '';

        $file_path = "images/" . bin2hex(random_bytes(2)) . date("Y-m-d");

        move_uploaded_file($image['tmp_name'], $file_path);

        $database->query(
            "INSERT INTO items (name, image, price, category_id, description)
            VALUES ('$name', '$file_path', $price, $category_id, '$description')"
        );
        break;
    
    case 'updateitem':
        $id = $_POST['id'] ?? error_exit('BAD_REQUEST', $_POST);
        $update_values = [];
        if(isset($_POST['name'])) $update_values[] = "name = '" . $_POST['name'] . "'";
        if(isset($_POST['price'])) $update_values[] = "price = '" . $_POST['price'] . "'";
        if(isset($_POST['category_id'])) $update_values[] = "category_id = " . $_POST['category_id'];
        if(isset($_POST['description'])) $update_values[] = "description = '" . $_POST['description'] . "'";

        $database->query("UPDATE items SET " . implode(',', $update_values) . "WHERE id = $id");
        break;

    case 'deleteitem':
        $id = $_POST['id'] ?? error_exit('BAD_REQUEST', $_POST);

        $database->query("DELETE FROM items WHERE id = $id");
        break;

        
    default:
        error_exit('NO_SUCH_METHOD', $method);
}

?>