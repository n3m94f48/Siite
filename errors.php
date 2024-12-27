<?php
function error_exit(string $err_name = 'GENERIC', mixed $extra_data=null){
    static $erros = [
        'GENERIC' => [400, 'Что-то пошло не так'],
        'BAD_REQUEST' => [400, 'Запрос сформирован неверно'],

        'UNAUTHENTICATED' => [401, 'Вы не вошли в систему'],
        'SESSION_INVALID' => [401, 'Сессия не действительна'],

        'NO_SUCH_METHOD' => [400, 'Запрошенного метода не существует'],
        'METHOD_NOT_ALLOWED' => [403, 'Недостаточно прав для совершения запрошенного действия'],

        'INSUFFICIENT_FUNDS' => [403, 'Недостаточно средств на балансе'],

        /*'CART_ILLEGAL_QUANTITY' => [422, 'Количество не может быть меньше 1'],*/
        /*'CART_ITEM_DUPLICATE' => [422, 'Товар уже находится в корзине'],*/
        'CART_ALREADY_PURCHASED' => [422, 'Заказ уже оплачен'],

        'USERNAME_TAKEN' => [422, 'Пользователь с таким логином уже существует'],
        'WEAK_PASSWORD' => [422, 'Пароль не соответствует требованиям'],
        'INVALID_CREDENTIALS' => [422, 'Неверный логин или пароль'],
    ];

    if(!isset($erros[$err_name])) $err_name = 'GENERIC';

    http_response_code($erros[$err_name][0]);

    $payload = [
        'name' => $err_name,
        'description' => $erros[$err_name][1]
    ];

    if($extra_data !== null) $payload['additional_info'] = $extra_data;

    echo json_encode($payload);
    exit();
}
?>