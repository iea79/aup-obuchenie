<?php
    $to = 'busforward@gmail.com'; //Почта получателя, через запятую можно указать сколько угодно адресов
    $subject = $_POST['subject'];
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $message = '
    <html>
        <head>
            <title>' . $subject . '</title>
        </head>
        <body>
            <h2>' . $subject . '</h2>
            <p>Контактное лицо: ' . $name . '</p>
            <p>Телефон: ' . $phone . '</p>
        </body>
    </html>';
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: АУП <info@frontendie.ru>\r\n"; //Наименование и почта отправителя

    if (mail($to, $subject, $message, $headers)) {
        echo "Успешно отправлено";
    } else {
        echo "Произошла ошибка, попробуйте позже";
    }
?>
