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
    $user_data = $database->query(
        "SELECT sessions.user_id AS id, users.username, users.funds AS name
        FROM sessions INNER JOIN users ON sessions.user_id = users.id
        WHERE sessions.id = '$session'"
    );

    if($user_data->num_rows < 1) error_exit('SESSION_INVALID');

    [$user_id, $username, $user_funds] = $user_data->fetch_array();
}

switch($method){
    case 'signup':
        $username = $_POST['username'] ?? error_exit('BAD_REQUEST', $_POST);
        $password = $_POST['password'] ?? error_exit('BAD_REQUEST', $_POST);

        if(strlen($password) < 6) error_exit('WEAK_PASSWORD');
        if(user_exists($username)) error_exit('USERNAME_TAKEN');

        $database->query(
            "INSERT INTO users (username, password)
            VALUES ('$username', '$password')"
        );
        break;
    
    case 'signin':
        $username = $_POST['username'] ?? error_exit('BAD_REQUEST', $_POST);
        $password = $_POST['password'] ?? error_exit('BAD_REQUEST', $_POST);

        if(!user_exists($username)) error_exit('INVALID_CREDENTIALS');

        $user_data = $database->query("SELECT id, password FROM users WHERE username = '$username'")->fetch_assoc();

        if($password != $user_data['password']) error_exit('INVALID_CREDENTIALS');

        $token = generate_token();
        $now = time();

        $database->query("INSERT INTO sessions VALUES ('$token', " . $user_data['id'] . ", $now)");

        response([
            'session_id' => $token
        ]);
        break;

    case 'signout':
        $database->query("DELETE FROM sessions WHERE id = '$session'");
        break;

    case 'getuser':
        $other_user = $_POST['user_id'] ?? error_exit('BAD_REQUEST', $_POST);

        response($database->query("SELECT username, about FROM users WHERE id = $other_user")->fetch_assoc());
        break;

    case 'getme':
        response($database->query("SELECT id, username, about, funds FROM users WHERE id = $user_id")->fetch_assoc());
        break;

    case 'editaboutme':
        $text = $_POST['text'] ?? error_exit('BAD_REQUEST', $_POST);

        $database->query("UPDATE users SET about = '$text' WHERE id = $user_id");

    case 'getcategories':
        response($database->query("SELECT * FROM item_categories")->fetch_all(MYSQLI_ASSOC));
        break;

    case 'getcategory':
        $category_id = $_POST['category_id'] ?? error_exit('BAD_REQUEST', $_POST);
        
        response($database->query("SELECT * FROM item_categories WHERE id = '$category_id'")->fetch_assoc());
        break;

    case 'getitems':
        $category_id = $_POST['category_id'] ?? error_exit('BAD_REQUEST', $_POST);

        response($database->query("SELECT id, name, image, price FROM items WHERE category_id = $category_id")->fetch_all(MYSQLI_ASSOC));
        break;
    
    case 'getitem':
        $item_id = $_POST['item_id'] ?? error_exit('BAD_REQUEST', $_POST);

        $item = $database->query("SELECT * FROM items WHERE id = '$item_id' LIMIT 1")->fetch_assoc();
        $item['category'] = $database->query("SELECT * FROM item_categories WHERE id = '". $item['category_id'] ."'")->fetch_assoc();

        unset($item['category_id']);
        
        response($item);
        break;
        
    case 'addreview':
        $item_id = $_POST['item_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $text = $_POST['text'] ?? error_exit('BAD_REQUEST', $_POST);

        $database->query("INSERT INTO reviews (user_id, item_id, text) VALUES ($user_id, $item_id, '$text')");
        break;

    case 'editreview':
        $item_id = $_POST['item_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $text = $_POST['review_text'] ?? error_exit('BAD_REQUEST', $_POST);

        $database->query("UPDATE reviews SET text = '$text' WHERE user_id = $user_id AND item_id = $item_id");
        break;

    
    case 'getitemreviews':
        $item_id = $_POST['item_id'] ?? error_exit('BAD_REQUEST', $_POST);

        $reviews = $database->query("SELECT * FROM reviews WHERE item_id = '$item_id'")->fetch_all(MYSQLI_ASSOC);
        foreach($reviews as &$review){
            $review['user'] = $database->query("SELECT id, username FROM users WHERE id = '". $review['user_id'] ."'")->fetch_assoc();
            unset($review['user_id']);
        }
        response($reviews);
        break;

    case 'newcart':
        $database->query("INSERT INTO user_carts (user_id) VALUES ($user_id)");
        response(['new_cart_id' => $database->insert_id]);
        break;

    case 'cartadditem':
        $cart_id = $_POST['cart_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $item_id = $_POST['item_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $quantity = 1;

        if($database->query("SELECT 1 FROM user_cart_items WHERE cart_id = $cart_id AND item_id = $item_id")->num_rows)
        {
            $quantity = $database->query("SELECT * FROM user_cart_items WHERE cart_id = $cart_id AND item_id = $item_id")->fetch_array()[2];
            $quantity = $quantity + 1;
            $database->query("UPDATE user_cart_items SET quantity = $quantity WHERE cart_id = $cart_id AND item_id = $item_id");
        }
        else
        {
            $database->query("INSERT INTO user_cart_items VALUES ($cart_id, $item_id, $quantity)");
        }
        break;

    case 'cartremoveitem':
        $cart_id = $_POST['cart_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $item_id = $_POST['item_id'] ?? error_exit('BAD_REQUEST', $_POST);

        $database->query("DELETE FROM user_cart_items WHERE cart_id = $cart_id AND item_id = $item_id");
        break;

    case 'cartupdatequantity':
        $cart_id = $_POST['cart_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $item_id = $_POST['item_id'] ?? error_exit('BAD_REQUEST', $_POST);
        $quantity = $_POST['quantity'] ?? error_exit('BAD_REQUEST', $_POST);;

        if($quantity < 0) error_exit('ILLEGAL_QUANTITY');

        $database->query("UPDATE user_cart_items SET quantity = $quantity WHERE cart_id = $cart_id AND item_id = $item_id");
        break;

    case 'getcartitems':
        $cart_id = $_POST['cart_id'] ?? error_exit('BAD_REQUEST', $_POST);

        $cart_entries = $database->query("SELECT item_id, quantity FROM user_cart_items WHERE cart_id = $cart_id")->fetch_all(MYSQLI_NUM);

        $cart_items = [];

        foreach($cart_entries as [$item_id, $quantity]){
            $item = $database->query("SELECT id, name, image, price FROM items WHERE id = $item_id")->fetch_assoc();
            $item['quantity'] = $quantity;

            $cart_items[] = $item;
        }

        response($cart_items);
        break;

    case 'purchasecart':
        $cart_id = $_POST['cart_id'] ?? error_exit('BAD_REQUEST', $_POST);

        if($database->query("SELECT 1 FROM user_carts WHERE id = $cart_id AND purchased = 1")->num_rows) error_exit('CART_ALREADY_PURCHASED');

        $cart_entries = $database->query("SELECT item_id, quantity FROM user_cart_items WHERE cart_id = $cart_id")->fetch_all(MYSQLI_NUM);

        $price = 0;

        foreach($cart_entries as [$item_id, $quantity]){
            $price += $database->query("SELECT price FROM items WHERE id = $item_id")->fetch_row()[0] * $quantity;
        }

        if($user_funds < $price) error_exit('INSUFFICIENT_FUNDS');

        $database->query("UPDATE users SET funds = '". $user_funds - $price . "' WHERE id = $user_id");
        $database->query("UPDATE user_carts SET purchased = 1 WHERE id = $cart_id AND user_id = ". $user_id);

        break;

    case 'getorders':
        $carts = $database->query("SELECT id FROM user_carts WHERE purchased = 1 AND user_id = ". $user_id)->fetch_all(MYSQLI_NUM);
        $orders = [];

        foreach($carts as [$cart_id]){
            $cart_entries = $database->query("SELECT item_id, quantity FROM user_cart_items WHERE cart_id = $cart_id")->fetch_all(MYSQLI_NUM);
            $items = [];

            foreach($cart_entries as [$item_id, $quantity]){
                $item = $database->query("SELECT id, name, image, price FROM items WHERE id = $item_id")->fetch_assoc();
                $item['quantity'] = $quantity;

                $items[] = $item;
            }

            $orders[] = ['id' => $cart_id, 'items' => $items];
        }

        response($orders);
        break;


    default:
        error_exit('NO_SUCH_METHOD', $method);
}

?>