<?php
declare(strict_types=1);

namespace Simpeg\Controllers;

use Simpeg\Catalog\ApiCatalog;
use Simpeg\Http\Response;

final class CatalogController
{
    public function __invoke(): void
    {
        Response::success(ApiCatalog::payload());
    }
}
