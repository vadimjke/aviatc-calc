<?php
        $to = 'it.vadik@gmail.com'; //Почта получателя, через запятую можно указать сколько угодно адресов
        $subject = 'Заявка с сайта'; //Загаловок сообщения
        $message = '
                <html>
                    <head>
                        <title>'.$subject.'</title>
                    </head>
                    <body>
                        <p>Имя: '.'test'.'</p>
                        <p>Телефон: '.'test'.'</p>                        
                    </body>
                </html>'; //Текст нащего сообщения можно использовать HTML теги
        $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
        $headers =  'MIME-Version: 1.0' . "\r\n"; 
        $headers .= 'From: Your name <info@address.com>' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n"; 
        mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail
?>