<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$storage = getenv('AFORMOSA_CMS_DIR') ?: dirname(__DIR__, 2) . '/aformosa-cms-data';
$file = $storage . '/content.json';
$stored = is_file($file) ? file_get_contents($file) : '';
$content = $stored ? json_decode($stored, true, 512, JSON_THROW_ON_ERROR) : [
    'weeks' => json_decode(file_get_contents(__DIR__ . '/default-menu.json'), true, 512, JSON_THROW_ON_ERROR),
    'banner' => null,
];

if (isset($_GET['content'])) {
    header('Content-Type: application/javascript; charset=utf-8');
    $banner = $content['banner'];
    echo 'window.aformosaContent = ' . json_encode([
        'weeks' => $content['weeks'],
        'banner' => $banner ? ['width' => $banner['width'], 'height' => $banner['height']] : null,
    ], JSON_HEX_TAG | JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR) . ';';
    exit;
}

if (isset($_GET['banner'])) {
    $banner = $content['banner'];
    if (!$banner) {
        http_response_code(404);
        exit;
    }
    header('Content-Type: ' . $banner['mime']);
    echo base64_decode($banner['data'], true);
    exit;
}

session_set_cookie_params([
    'httponly' => true,
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Strict',
]);
session_start();
$_SESSION['token'] ??= bin2hex(random_bytes(32));
$hash = getenv('AFORMOSA_CMS_PASSWORD_HASH');
if (!$hash && is_readable($storage . '/password.hash')) {
    $hash = trim(file_get_contents($storage . '/password.hash'));
}

function escape($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function dateValue($value): string
{
    $date = is_string($value) ? DateTimeImmutable::createFromFormat('!Y-m-d', $value) : false;
    if (!$date || $date->format('Y-m-d') !== $value) {
        throw new DomainException('Isi tanggal yang valid.');
    }
    return $value;
}

function numberValue($value, int $min): int
{
    $number = filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => $min]]);
    if ($number === false) {
        throw new DomainException('Periksa nomor batch dan angka kalori.');
    }
    return $number;
}

function mealText($value, bool $required): string
{
    $text = is_string($value) ? trim($value) : '';
    if (($required && $text === '') || strlen($text) > 800 || !preg_match('//u', $text)) {
        throw new DomainException('Periksa nama dan deskripsi menu.');
    }
    return $text;
}

function uploadBanner(array $upload): ?array
{
    if ($upload['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($upload['error'] !== UPLOAD_ERR_OK || $upload['size'] > 5 * 1024 * 1024) {
        throw new DomainException('Unggah banner dengan ukuran maksimal 5 MB.');
    }
    $info = @getimagesize($upload['tmp_name']);
    if (!$info || !in_array($info['mime'], ['image/jpeg', 'image/png', 'image/webp'], true)
        || $info[0] >= $info[1] || $info[0] > 6000 || $info[1] > 6000) {
        throw new DomainException('Gunakan gambar potret JPG, PNG, atau WebP dengan sisi maksimal 6000 piksel.');
    }
    return [
        'width' => $info[0], 'height' => $info[1], 'mime' => $info['mime'],
        'data' => base64_encode(file_get_contents($upload['tmp_name'])),
    ];
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (!hash_equals($_SESSION['token'], (string) ($_POST['token'] ?? ''))) {
            throw new DomainException('Sesi formulir kedaluwarsa. Muat ulang halaman.');
        }
        $action = $_POST['action'] ?? '';
        if ($action === 'login') {
            if (!$hash || !password_verify((string) ($_POST['password'] ?? ''), $hash)) {
                usleep(400000);
                throw new DomainException('Kata sandi salah atau CMS belum dikonfigurasi.');
            }
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
        } elseif ($action === 'logout') {
            $_SESSION = [];
            session_destroy();
        } elseif ($action === 'save' && !empty($_SESSION['admin']) && $hash) {
            foreach ($content['weeks'] as $index => &$week) {
                $input = $_POST['weeks'][$index] ?? [];
                $week['batch'] = numberValue($input['batch'] ?? null, 1);
                $week['start'] = dateValue($input['start'] ?? null);
                $week['end'] = dateValue($input['end'] ?? null);
                if ($week['start'] > $week['end']) {
                    throw new DomainException('Tanggal akhir batch harus sama dengan atau setelah tanggal mulai.');
                }
                $previous = null;
                foreach ($week['days'] as $dayIndex => &$day) {
                    $dayInput = $input['days'][$dayIndex] ?? [];
                    $date = dateValue($dayInput['date'] ?? null);
                    if ($date < $week['start'] || $date > $week['end'] || ($previous && $date <= $previous)) {
                        throw new DomainException('Tanggal menu harus berurutan dan masuk dalam rentang batch.');
                    }
                    $day['date'] = $previous = $date;
                    $weekday = (int) (new DateTimeImmutable($date))->format('N') - 1;
                    $day['day'] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'][$weekday];
                    $day['shortDay'] = substr($day['day'], 0, 3);
                    foreach (['lunch', 'dinner'] as $meal) {
                        $dish = $dayInput[$meal] ?? [];
                        $day[$meal] = [
                            'name' => mealText($dish['name'] ?? null, true),
                            'description' => mealText($dish['description'] ?? null, false),
                            'kcal' => numberValue($dish['kcal'] ?? null, 0),
                        ];
                    }
                }
                unset($day);
            }
            unset($week);
            $content['banner'] = uploadBanner($_FILES['banner'] ?? ['error' => UPLOAD_ERR_NO_FILE]) ?? $content['banner'];
            $lock = @fopen($storage . '/publish.lock', 'c');
            if (!$lock || !flock($lock, LOCK_EX)) {
                throw new DomainException('Folder penyimpanan CMS tidak dapat ditulis.');
            }
            try {
                $current = is_file($file) ? file_get_contents($file) : '';
                if (!hash_equals(hash('sha256', (string) $current), (string) ($_POST['revision'] ?? ''))) {
                    throw new DomainException('Konten baru saja diperbarui. Muat ulang sebelum mengedit lagi.');
                }
                $json = json_encode($content, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
                if (file_put_contents($file . '.tmp', $json) !== strlen($json) || !rename($file . '.tmp', $file)) {
                    throw new DomainException('Konten gagal disimpan.');
                }
            } finally {
                flock($lock, LOCK_UN);
                fclose($lock);
            }
            $_SESSION['saved'] = true;
        } else {
            throw new DomainException('Masuk untuk mengedit konten.');
        }
        header('Location: ./', true, 303);
        exit;
    } catch (DomainException $exception) {
        $error = $exception->getMessage();
    }
}
$saved = !empty($_SESSION['saved']);
unset($_SESSION['saved']);
$admin = !empty($_SESSION['admin']) && $hash;
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kelola konten Aformosa</title>
<link rel="stylesheet" href="admin.css">
</head>
<body>
<main>
<h1>Kelola konten Aformosa</h1>
<?php if ($error): ?><p role="alert"><?= escape($error) ?></p><?php endif ?>
<?php if ($saved): ?><p role="status">Perubahan sudah tampil di website.</p><?php endif ?>
<?php if (!$admin): ?>
<form method="post">
    <input type="hidden" name="token" value="<?= escape($_SESSION['token']) ?>">
    <input type="hidden" name="action" value="login">
    <label>Kata sandi <input type="password" name="password" autocomplete="current-password" required></label>
    <button>Masuk</button>
</form>
<?php else: ?>
<nav><a href="../">Lihat homepage</a>
    <form method="post">
        <input type="hidden" name="token" value="<?= escape($_SESSION['token']) ?>">
        <button name="action" value="logout">Keluar</button>
    </form>
</nav>
<form method="post" enctype="multipart/form-data">
    <input type="hidden" name="token" value="<?= escape($_SESSION['token']) ?>">
    <input type="hidden" name="revision" value="<?= hash('sha256', (string) $stored) ?>">
    <section>
        <h2>Banner homepage mobile</h2>
        <img class="preview" src="<?= $content['banner'] ? '?banner=1' : '../assets/hero%20mobile.jpeg' ?>" alt="Banner mobile yang dipublikasikan">
        <label>Ganti banner <input type="file" name="banner" accept="image/jpeg,image/png,image/webp"></label>
        <p>Gunakan gambar potret, maksimal 5 MB. Biarkan kosong untuk memakai gambar yang sekarang.</p>
    </section>
    <h2>Batch dan menu mingguan</h2>
    <p>Pilih minggu untuk mengedit. Ketiga tab di website mengikuti pengaturan di bawah ini.</p>
    <?php foreach ($content['weeks'] as $index => $week): ?>
    <details <?= $index === 1 ? 'open' : '' ?>>
        <summary><?= ['Minggu lalu', 'Minggu ini', 'Minggu depan'][$index] ?></summary>
        <?php $prefix = "weeks[$index]"; ?>
        <div class="grid">
            <label>Batch <input name="<?= $prefix ?>[batch]" type="number" min="1" value="<?= escape($week['batch']) ?>" required></label>
            <label>Tanggal mulai <input name="<?= $prefix ?>[start]" type="date" value="<?= escape($week['start']) ?>" required></label>
            <label>Tanggal akhir <input name="<?= $prefix ?>[end]" type="date" value="<?= escape($week['end']) ?>" required></label>
        </div>
        <?php foreach ($week['days'] as $dayIndex => $day): ?>
        <?php $dayPrefix = $prefix . "[days][$dayIndex]"; ?>
        <fieldset>
            <legend>Menu hari <?= $dayIndex + 1 ?></legend>
            <label>Tanggal menu <input name="<?= $dayPrefix ?>[date]" type="date" value="<?= escape($day['date']) ?>" required></label>
            <div class="grid">
            <?php foreach (['lunch' => 'Makan siang', 'dinner' => 'Makan malam'] as $meal => $label): ?>
                <fieldset>
                    <legend><?= $label ?></legend>
                    <label>Nama menu <input name="<?= $dayPrefix ?>[<?= $meal ?>][name]" value="<?= escape($day[$meal]['name']) ?>" required></label>
                    <label>Deskripsi <input name="<?= $dayPrefix ?>[<?= $meal ?>][description]" value="<?= escape($day[$meal]['description']) ?>"></label>
                    <label>Kalori (kkal) <input name="<?= $dayPrefix ?>[<?= $meal ?>][kcal]" type="number" min="0" value="<?= escape($day[$meal]['kcal']) ?>" required></label>
                </fieldset>
            <?php endforeach ?>
            </div>
        </fieldset>
        <?php endforeach ?>
    </details>
    <?php endforeach ?>
    <button name="action" value="save">Simpan dan terbitkan</button>
</form>
<?php endif ?>
</main>
</body>
</html>
