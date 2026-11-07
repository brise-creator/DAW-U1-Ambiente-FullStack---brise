if ($password !== '') {
$hash = password_hash($password,PASSWORD_DEFAULT);
$sql = '
UPDATE usuarios
SET
usuario = :usuario,
nombre = :nombre,
email = :email,
rol = :rol,
password_hash = :password_hash
WHERE id = :id
';
} else {
$sql = '
UPDATE usuarios
SET
usuario = :usuario,
nombre = :nombre,
email = :email,
rol = :rol
WHERE id = :id