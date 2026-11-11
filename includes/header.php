<?php
$portfolioData = require __DIR__ . '/../data/portfolio-data.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <title>dasmeds | Home</title>
    <script>
        try {
            if (localStorage.getItem('dasmeds-theme') === 'dark') {
                document.documentElement.dataset.theme = 'dark';
            }
        } catch (error) {
            console.warn('Saved theme could not be read; using the light theme.', error);
        }
    </script>
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/portfolio-overrides.css">
    <script>
        window.portfolioData = <?= json_encode(
            $portfolioData,
            JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        ) ?>;
    </script>
</head>
<body class="continuous-portfolio">
