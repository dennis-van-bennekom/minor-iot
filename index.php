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
                    <li class="navigation__item"><a href="/" class="navigation__link current">Dashboard</a></li>
                    <li class="navigation__item"><a href="instellingen.php" class="navigation__link">Instellingen</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <main class="content">
        <div class="graph">
            <h1 class="graph__title">Geluid</h1>
        
            <div class="timespan">
                <button data-timespan="day" class="timespan__button js-timespan current">Dag</button>
                <button data-timespan="week" class="timespan__button js-timespan">Week</button>
                <button data-timespan="month" class="timespan__button js-timespan">Maand</button>
            </div>
            
            <canvas class="graph__chart js-sound-chart"></canvas>
        </div>
    </main>
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.12.0/lodash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.3/Chart.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment-with-locales.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/locale/nl.js"></script>
    <script src="main.js"></script>
</body>
</html>