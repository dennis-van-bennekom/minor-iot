<?php
    $content = file_get_contents('settings.json');
    $json = json_decode($content, true);
    
    $alarm = $json['alarm'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="stylesheet" href="normalize.css">
    <link rel="stylesheet" href="style.css">
    <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700|Roboto:400,300,500,700,100,100italic,300italic,400italic,500italic,700italic,900italic,900' rel='stylesheet' type='text/css'>
</head>
<body>
    <header class="header">
        <div class="header__inner">
            <h1 class="header__title">Dieren Geluid</h1>
        
            <nav class="navigation">
                <ul class="navigation__list">
                    <li class="navigation__item"><a href="/" class="navigation__link">Dashboard</a></li>
                    <li class="navigation__item"><a href="instellingen.php" class="navigation__link current">Instellingen</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main class="content">
        <div class="settings">
            <p class="settings__text">
                Stel hier het level in wanneer een alarm gegeven moet worden. 0 is altijd alarm, 10 is alleen alarm als er heel veel geluid is.
            </p>
            <form class="settings__form" action="settings.php" method="POST">
                <label class="settings__label" for="alarm">Alarm level: </label>
                <input class="settings__input" id="alarm" name="alarm" type="number" min="0" max="10" value="<?php echo $alarm ?>">
                
                <button class="settings__button">Opslaan</button>
            </form>
        </div>
    </main>
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <script src="instellingen.js"></script>
</body>
</html>