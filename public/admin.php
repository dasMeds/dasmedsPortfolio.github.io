<?php
declare(strict_types=1);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Portfolio Admin | dasmeds</title>
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <link rel="stylesheet" href="/admin.css">
    <script type="module" src="/admin.js"></script>
</head>
<body>
    <main class="admin-shell">
        <header class="admin-header">
            <a class="admin-brand" href="/">DASMEDS<span>.</span></a>
            <a href="/" class="admin-back">Back to portfolio</a>
        </header>

        <section class="admin-login" id="admin-login">
            <p class="admin-eyebrow">Private workspace / 01</p>
            <h1>Portfolio admin</h1>
            <p>Sign in to manage your certifications, documents, posters, repositories, and videos.</p>
            <form id="admin-login-form">
                <label for="admin-username">Username</label>
                <input id="admin-username" name="username" autocomplete="username" required>
                <label for="admin-password">Password</label>
                <input id="admin-password" name="password" type="password" autocomplete="current-password" required>
                <button type="submit">Sign in</button>
            </form>
            <p class="admin-message" id="admin-login-message" role="status"></p>
        </section>

        <section class="admin-dashboard" id="admin-dashboard" hidden>
            <div class="admin-title-row">
                <div>
                    <p class="admin-eyebrow">Content management / 02</p>
                    <h1>Portfolio content</h1>
                </div>
                <button class="admin-secondary" id="admin-logout" type="button">Sign out</button>
            </div>
            <p class="admin-notice">Saves create a commit in this GitHub repository. The public site reflects changes after its deployment finishes.</p>
            <div class="admin-resume">
                <div>
                    <label for="admin-resume-path">Resume PDF</label>
                    <input id="admin-resume-path" autocomplete="off">
                </div>
                <label class="admin-upload">
                    Upload replacement PDF
                    <input type="file" id="admin-resume-file" accept="application/pdf,.pdf">
                </label>
            </div>
            <div class="admin-workspace">
                <nav class="admin-sections" id="admin-sections" aria-label="Portfolio content sections"></nav>
                <div class="admin-record-list">
                    <div class="admin-list-heading">
                        <h2 id="admin-list-title">Certifications</h2>
                        <button class="admin-secondary" id="admin-add" type="button">Add new</button>
                    </div>
                    <div id="admin-records"></div>
                </div>
                <form class="admin-editor" id="admin-editor"></form>
            </div>
            <footer class="admin-footer">
                <p class="admin-message" id="admin-message" role="status"></p>
                <button id="admin-save" type="button">Save changes to GitHub</button>
            </footer>
        </section>
    </main>
</body>
</html>
