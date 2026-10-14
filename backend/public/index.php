<?php
declare(strict_types=1);

use Simpeg\Controllers\EmployeeController;
use Simpeg\Controllers\CatalogController;
use Simpeg\Controllers\AuthController;
use Simpeg\Controllers\HealthController;
use Simpeg\Controllers\ResourceController;
use Simpeg\Database\Connection;
use Simpeg\Http\Request;
use Simpeg\Http\Response;
use Simpeg\Repositories\EmployeeRepository;
use Simpeg\Routing\Router;

date_default_timezone_set('Asia/Jakarta');

require_once dirname(__DIR__) . '/src/autoload.php';

$request = new Request();
if ($request->method() === 'OPTIONS') {
    Response::options();
}

$router = new Router();
$router->get('/', static function (): void {
    Response::success(array(
        'name' => 'SIMPEG API',
        'version' => 'simpeg-v3',
        'routes' => array(
            '/health',
            '/catalog',
            '/auth/login',
            '/auth/me',
            '/auth/logout',
            '/resources/{resource}',
            '/resources/{resource}/{id}',
            '/pegawai',
            '/pegawai/{id_peg}',
            '/pegawai/{id_peg}/keluarga',
        ),
    ));
});
$router->get('/health', new HealthController());
$router->get('/catalog', new CatalogController());

$authController = new AuthController();
$router->post('/auth/login', array($authController, 'login'));
$router->get('/auth/me', array($authController, 'me'));
$router->post('/auth/logout', array($authController, 'logout'));

$router->get('/pegawai', static function (Request $request, array $params): void {
    try {
        $connection = Connection::make(dirname(__DIR__, 2));
        (new EmployeeController(new EmployeeRepository($connection)))->index($request, $params);
    } catch (Throwable $exception) {
        error_log($exception->getMessage());
        Response::error('Koneksi API gagal.', 500);
    }
});
$router->get('/pegawai/{id_peg}/keluarga', static function (Request $request, array $params): void {
    try {
        $connection = Connection::make(dirname(__DIR__, 2));
        (new EmployeeController(new EmployeeRepository($connection)))->family($request, $params);
    } catch (Throwable $exception) {
        error_log($exception->getMessage());
        Response::error('Koneksi API gagal.', 500);
    }
});
$router->get('/pegawai/{id_peg}', static function (Request $request, array $params): void {
    try {
        $connection = Connection::make(dirname(__DIR__, 2));
        (new EmployeeController(new EmployeeRepository($connection)))->show($request, $params);
    } catch (Throwable $exception) {
        error_log($exception->getMessage());
        Response::error('Koneksi API gagal.', 500);
    }
});

$resourceController = new ResourceController();
$router->get('/resources/{resource}/{id}', array($resourceController, 'show'));
$router->get('/resources/{resource}', array($resourceController, 'index'));
$router->post('/resources/{resource}', array($resourceController, 'store'));
$router->put('/resources/{resource}/{id}', array($resourceController, 'update'));
$router->patch('/resources/{resource}/{id}', array($resourceController, 'update'));
$router->delete('/resources/{resource}/{id}', array($resourceController, 'destroy'));

$router->dispatch($request);
