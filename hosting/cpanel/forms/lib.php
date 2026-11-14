<?php
/**
 * Shared code for the Exron Global form handlers (rfq.php, contact.php).
 * Uses only the hosting account's own PHP and mail server; no outside services.
 */
declare(strict_types=1);

if (!defined('EXRON_FORMS')) {
    http_response_code(403);
    exit;
}

$CONFIG = require __DIR__ . '/config.php';
$SITE = json_decode((string) @file_get_contents(__DIR__ . '/site.json'), true) ?: [];

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'jpg', 'jpeg', 'png'];
const BLOCKED_MIME = '#(x-dosexec|x-executable|x-msdownload|x-sharedlib|x-mach|php|x-sh|javascript|html|x-msi)#i';
const REFERENCE_RE = '/^EXR-RFQ-\d{6}-[A-Z0-9]{4}$/';
const SECURE_NOTICE = 'Do not send classified information, Controlled Unclassified Information (CUI) or export-controlled technical data through this website. If your requirement involves such information, contact us first to agree an appropriate secure method of transmission.';

function cfg(string $key, $default = null)
{
    global $CONFIG;
    return $CONFIG[$key] ?? $default;
}

function site(string $key): string
{
    global $SITE;
    $v = $SITE[$key] ?? '';
    return is_string($v) ? $v : '';
}

/** Values still marked [CLIENT TO PROVIDE …] or [CONFIRM …] count as not set. */
function is_set_value(string $v): bool
{
    return $v !== '' && !preg_match('/\[(CONFIRM|CLIENT TO PROVIDE)/', $v);
}

function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/** Single-line field: no line breaks or control characters (blocks email header injection). */
function field_line(string $name, int $max): string
{
    $v = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

/** Multi-line field: keeps line breaks, removes other control characters. */
function field_text(string $name, int $max): string
{
    $v = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

function valid_email(string $e): bool
{
    return $e !== '' && filter_var($e, FILTER_VALIDATE_EMAIL) !== false;
}

function inbox(string $key): array
{
    $list = array_values(array_filter((array) cfg($key, []), 'valid_email'));
    if ($list) return $list;
    $procurement = site('procurementEmail');
    return [is_set_value($procurement) && valid_email($procurement) ? $procurement : (site('email') ?: 'info@exronglobal.com')];
}

/** Honeypot filled, or form sent within seconds of opening: almost certainly automated. */
function looks_automated(): bool
{
    if (!empty($_POST['bot-field'])) return true;
    $started = isset($_POST['started']) ? (int) $_POST['started'] : 0;
    if ($started > 0) {
        $elapsed = time() - intdiv($started, 1000);
        if ($elapsed >= 0 && $elapsed < (int) cfg('min_seconds', 3)) return true;
    }
    return false;
}

function storage_root(): ?string
{
    $dir = (string) cfg('storage_dir', '');
    if ($dir === '') {
        $docroot = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__)), '/');
        $dir = dirname($docroot) . '/exron-submissions';
    }
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return null;
    if (!is_writable($dir)) return null;
    if (!file_exists("$dir/.htaccess")) @file_put_contents("$dir/.htaccess", "Require all denied\n");
    return $dir;
}

/** Limits each visitor to a number of submissions per hour. Only a hash of the IP address is stored. */
function rate_limited(string $bucket): bool
{
    $root = storage_root();
    if ($root === null) return false;
    $dir = "$root/.rate";
    if (!is_dir($dir)) @mkdir($dir, 0700);
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $file = "$dir/" . $bucket . '-' . hash('sha256', $ip . '|exron') . '.txt';
    $now = time();
    $times = is_file($file) ? array_map('intval', file($file, FILE_IGNORE_NEW_LINES) ?: []) : [];
    $times = array_values(array_filter($times, fn($t) => $t > $now - 3600));
    if (count($times) >= (int) cfg('rate_limit_per_hour', 10)) return true;
    $times[] = $now;
    @file_put_contents($file, implode("\n", $times), LOCK_EX);
    return false;
}

function make_reference(): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $suffix = '';
    for ($i = 0; $i < 4; $i++) $suffix .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    return 'EXR-RFQ-' . gmdate('ymd') . '-' . $suffix;
}

/**
 * Collect uploaded files: type, size and content checks. Accepted files are read into memory for
 * attaching to the email; nothing is ever saved inside the public website folder.
 * Returns [accepted[], rejected[]] where rejected holds "name: reason".
 */
function collect_uploads(): array
{
    $accepted = [];
    $rejected = [];
    $total = 0;
    $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : null;
    for ($n = 1; $n <= (int) cfg('max_files', 3); $n++) {
        $f = $_FILES["attachment_$n"] ?? null;
        if (!$f || !is_array($f) || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
        $name = basename((string) ($f['name'] ?? 'attachment'));
        $name = preg_replace('/[^A-Za-z0-9._ ()-]+/', '_', $name) ?: 'attachment';
        if (($f['error'] ?? 0) !== UPLOAD_ERR_OK) { $rejected[] = "$name: upload failed or too large"; continue; }
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXTENSIONS, true)) { $rejected[] = "$name: file type not accepted"; continue; }
        $tmp = (string) $f['tmp_name'];
        if (!is_uploaded_file($tmp)) { $rejected[] = "$name: upload failed"; continue; }
        $mime = $finfo ? (string) finfo_file($finfo, $tmp) : 'application/octet-stream';
        if (preg_match(BLOCKED_MIME, $mime)) { $rejected[] = "$name: file content not accepted"; continue; }
        $size = (int) filesize($tmp);
        if ($total + $size > (int) cfg('max_total_bytes', 8 * 1024 * 1024)) { $rejected[] = "$name: over the 8 MB total"; continue; }
        $total += $size;
        $accepted[] = ['name' => $name, 'mime' => $mime ?: 'application/octet-stream', 'data' => (string) file_get_contents($tmp), 'size' => $size];
    }
    return [$accepted, $rejected];
}

/** Save a private copy of a submission and its files. Returns false if storage is unavailable. */
function save_copy(string $id, array $record, array $files = []): bool
{
    if (!cfg('save_copies', true)) return false;
    $root = storage_root();
    if ($root === null) return false;
    $dir = "$root/" . gmdate('Y-m') . "/$id";
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) return false;
    $ok = @file_put_contents("$dir/submission.json", json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) !== false;
    foreach ($files as $f) $ok = (@file_put_contents("$dir/" . $f['name'], $f['data']) !== false) && $ok;
    return $ok;
}

function encode_header(string $s): string
{
    return preg_match('/[^\x20-\x7E]/', $s) ? '=?UTF-8?B?' . base64_encode($s) . '?=' : $s;
}

/** Send an email through the hosting account's own mail server, with optional attachments. */
function send_mail(array $to, string $subject, string $html, string $text, ?string $replyTo = null, array $files = []): bool
{
    $from = (string) cfg('from_email', 'rfq@exronglobal.com');
    $fromName = (string) cfg('from_name', 'Exron Global');
    $mixed = 'mixed_' . bin2hex(random_bytes(12));
    $alt = 'alt_' . bin2hex(random_bytes(12));

    $headers = [
        'From: ' . encode_header($fromName) . " <$from>",
        'MIME-Version: 1.0',
        "Content-Type: multipart/mixed; boundary=\"$mixed\"",
    ];
    if ($replyTo !== null && valid_email($replyTo)) $headers[] = "Reply-To: $replyTo";

    $body = "--$mixed\r\nContent-Type: multipart/alternative; boundary=\"$alt\"\r\n\r\n"
        . "--$alt\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text)) . "\r\n"
        . "--$alt\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html)) . "\r\n--$alt--\r\n";
    foreach ($files as $f) {
        $name = str_replace('"', '', $f['name']);
        $body .= "--$mixed\r\nContent-Type: {$f['mime']}; name=\"$name\"\r\nContent-Transfer-Encoding: base64\r\n"
            . "Content-Disposition: attachment; filename=\"$name\"\r\n\r\n" . chunk_split(base64_encode($f['data'])) . "\r\n";
    }
    $body .= "--$mixed--\r\n";

    return @mail(implode(', ', $to), encode_header($subject), $body, implode("\r\n", $headers), '-f' . $from);
}

function email_table(array $rows): string
{
    $out = '';
    foreach ($rows as [$k, $v]) {
        if ($v === '') continue;
        $out .= '<tr><th align="left" valign="top" style="width:190px;border-bottom:1px solid #D9DAE0;color:#5C6070;font-weight:normal;padding:8px">' . esc($k)
            . '</th><td style="border-bottom:1px solid #D9DAE0;color:#1E1E2A;padding:8px">' . nl2br(esc($v)) . '</td></tr>';
    }
    return '<table cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;width:100%;max-width:680px">' . $out . '</table>';
}

function email_text(array $rows): string
{
    $out = [];
    foreach ($rows as [$k, $v]) if ($v !== '') $out[] = "$k: $v";
    return implode("\n", $out);
}

function email_wrap(string $inner): string
{
    return '<div style="font-family:Arial,sans-serif;color:#1E1E2A;line-height:1.5"><div style="background:#3C3B6E;color:#fff;padding:16px 20px;font-weight:bold;letter-spacing:.04em">EXRON GLOBAL</div><div style="padding:20px">'
        . $inner . '</div><p style="padding:0 20px;font-size:12px;color:#5C6070">' . esc(site('disclaimer')) . '</p></div>';
}

function received_at(): string
{
    return gmdate('j M Y, H:i') . ' UTC';
}

function redirect_to(string $path): void
{
    header('Location: ' . $path, true, 303);
    exit;
}

/** Plain error page in the site's colours, with the email fallback. */
function fail_page(int $status, string $title, array $lines, string $back): void
{
    http_response_code($status);
    $fallback = is_set_value(site('procurementEmail')) ? site('procurementEmail') : (site('email') ?: 'info@exronglobal.com');
    $items = implode('', array_map(fn($l) => '<li>' . esc($l) . '</li>', $lines));
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>'
        . esc($title) . ' | Exron Global</title><style>body{margin:0;font:16px/1.6 Arial,sans-serif;color:#1c1d30;background:#f7f7fa}header{background:#2d2c5b;border-top:4px solid #b22234;color:#fff;padding:28px 20px}main{max-width:720px;margin:0 auto;padding:28px 20px}h1{margin:0;font-size:26px}a{color:#3c3b6e}.btn{display:inline-block;margin-top:12px;padding:12px 20px;background:#b22234;color:#fff;text-decoration:none;border-radius:3px;font-weight:bold}</style></head><body><header><h1>'
        . esc($title) . '</h1></header><main>' . ($items ? "<ul>$items</ul>" : '')
        . '<p>Use your browser\'s back button to return to the form; your entries are usually kept.</p>'
        . '<p>Or email your request to <a href="mailto:' . esc($fallback) . '">' . esc($fallback) . '</a>.</p>'
        . '<a class="btn" href="' . esc($back) . '">Back to the form</a></main></body></html>';
    exit;
}
