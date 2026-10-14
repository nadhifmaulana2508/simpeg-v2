<?php
declare(strict_types=1);

namespace Simpeg\Controllers;

use Simpeg\Http\Response;

final class HealthController
{
    public function __invoke(): void
    {
        Response::success(array(
            'name' => 'SIMPEG API',
            'status' => 'ok',
            'runtime' => PHP_VERSION,
            'version' => 'simpeg-v3',
            'timestamp' => date(DATE_ATOM),
        ));
    }
}
