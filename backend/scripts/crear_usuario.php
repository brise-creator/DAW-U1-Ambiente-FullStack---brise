<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

try {
    // Conexión a la base de datos
    $pdo = getPDO();

    // Datos del nuevo usuario
    $usuario = 'alumno';
    $nombre = 'Alumno de prueba';
    $password = 'alumno2026';
    $rol = 'Usuario';

    // Convertir contraseña a hash
    $passwordHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    // Comprobar si el usuario existe
    $consulta = $pdo->prepare(
        'SELECT id FROM usuarios
         WHERE usuario = :usuario
         LIMIT 1'
    );

    $consulta->execute([
        ':usuario' => $usuario
    ]);

    $existente = $consulta->fetch();

    if ($existente) {

        // Actualizar el alumno
        $sql = $pdo->prepare(
            'UPDATE usuarios
             SET nombre = :nombre,
                 password_hash = :password_hash,
                 rol = :rol,
                 activo = 1
             WHERE usuario = :usuario'
        );

    } else {

        // Insertar el nuevo alumno
        $sql = $pdo->prepare(
            'INSERT INTO usuarios
             (usuario, nombre, password_hash, rol, activo)
             VALUES
             (:usuario, :nombre, :password_hash, :rol, 1)'
        );
    }

    $sql->execute([
        ':usuario' => $usuario,
        ':nombre' => $nombre,
        ':password_hash' => $passwordHash,
        ':rol' => $rol
    ]);

    echo "Alumno creado/actualizado correctamente.\n";

} catch (Throwable $e) {
    echo "Error al crear alumno: "
        . $e->getMessage() . "\n";
}