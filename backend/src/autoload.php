<?php
declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
    $prefix = 'Simpeg\\';
    if (strpos($class, $prefix) !== 0) {
        return;
    }

    $relative = str_replace('\\', DIRECTORY_SEPARATOR, substr($class, strlen($prefix)));
    $file = __DIR__ . DIRECTORY_SEPARATOR . $relative . '.php';

    if (is_file($file)) {
        require_once $file;
    }
});
