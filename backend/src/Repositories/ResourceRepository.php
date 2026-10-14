<?php
declare(strict_types=1);

namespace Simpeg\Repositories;

use mysqli;
use RuntimeException;

final class ResourceRepository
{
    /** @param array<string, mixed> $definition */
    public function __construct(private mysqli $connection, private array $definition)
    {
    }

    /** @return array{items: array<int, array<string, mixed>>, total: int} */
    public function paginate(int $page, int $limit, string $keyword = ''): array
    {
        $columns = $this->columns();
        $where = array();
        $types = '';
        $params = array();
        $searchColumns = array_values(array_intersect($this->definition['search_columns'], $columns));

        if ($keyword !== '' && $searchColumns !== array()) {
            $where[] = '(' . implode(' OR ', array_map(fn (string $column): string => $this->identifier($column) . ' LIKE ?', $searchColumns)) . ')';
            $types = str_repeat('s', count($searchColumns));
            foreach ($searchColumns as $unused) {
                $params[] = '%' . $keyword . '%';
            }
        }

        $whereSql = $where === array() ? '' : ' WHERE ' . implode(' AND ', $where);
        $table = $this->identifier($this->definition['table']);
        $countRow = $this->fetchOne('SELECT COUNT(*) AS total FROM ' . $table . $whereSql, $types, $params);
        $offset = ($page - 1) * $limit;
        $selectColumns = implode(', ', array_map(fn (string $column): string => $this->identifier($column), $columns));
        $primaryKey = $this->identifier($this->definition['primary_key']);
        $rows = $this->fetchAll(
            'SELECT ' . $selectColumns . ' FROM ' . $table . $whereSql . ' ORDER BY ' . $primaryKey . ' DESC LIMIT ' . $limit . ' OFFSET ' . $offset,
            $types,
            $params
        );

        return array('items' => $this->sanitizeRows($rows), 'total' => (int) ($countRow['total'] ?? 0));
    }

    /** @return array<string, mixed>|null */
    public function find(string $id): ?array
    {
        $columns = $this->columns();
        $sql = 'SELECT ' . implode(', ', array_map(fn (string $column): string => $this->identifier($column), $columns))
            . ' FROM ' . $this->identifier($this->definition['table'])
            . ' WHERE ' . $this->identifier($this->definition['primary_key']) . ' = ? LIMIT 1';
        $row = $this->fetchOne($sql, 's', array($id));
        if ($row === null) {
            return null;
        }

        return $this->sanitizeRows(array($row))[0] ?? null;
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    public function create(array $input): array
    {
        $data = $this->filterInput($input, $this->columns());
        if ($data === array()) {
            throw new RuntimeException('Body resource tidak memiliki field yang dapat disimpan.');
        }

        $fields = array_keys($data);
        $placeholders = implode(', ', array_fill(0, count($fields), '?'));
        $sql = 'INSERT INTO ' . $this->identifier($this->definition['table'])
            . ' (' . implode(', ', array_map(fn (string $field): string => $this->identifier($field), $fields)) . ')'
            . ' VALUES (' . $placeholders . ')';
        $statement = $this->prepare($sql);
        $values = array_values($data);
        $this->bind($statement, str_repeat('s', count($values)), $values);
        if (!$statement->execute()) {
            $message = $statement->error;
            $statement->close();
            throw new RuntimeException($message ?: 'Data resource gagal disimpan.');
        }
        $insertId = (string) $this->connection->insert_id;
        $statement->close();

        if ($insertId !== '0' && $insertId !== '') {
            return $this->find($insertId) ?? array($this->definition['primary_key'] => $insertId) + $data;
        }
        if (isset($data[$this->definition['primary_key']])) {
            return $this->find((string) $data[$this->definition['primary_key']]) ?? $data;
        }

        return $data;
    }

    /** @param array<string, mixed> $input @return array<string, mixed>|null */
    public function update(string $id, array $input): ?array
    {
        $data = $this->filterInput($input, $this->columns(), false);
        if ($data === array()) {
            throw new RuntimeException('Body resource tidak memiliki field yang dapat diubah.');
        }

        $assignments = implode(', ', array_map(fn (string $field): string => $this->identifier($field) . ' = ?', array_keys($data)));
        $sql = 'UPDATE ' . $this->identifier($this->definition['table'])
            . ' SET ' . $assignments
            . ' WHERE ' . $this->identifier($this->definition['primary_key']) . ' = ?';
        $statement = $this->prepare($sql);
        $values = array_values($data);
        $values[] = $id;
        $this->bind($statement, str_repeat('s', count($values)), $values);
        if (!$statement->execute()) {
            $message = $statement->error;
            $statement->close();
            throw new RuntimeException($message ?: 'Data resource gagal diubah.');
        }
        $statement->close();
        return $this->find($id);
    }

    public function delete(string $id): bool
    {
        $sql = 'DELETE FROM ' . $this->identifier($this->definition['table'])
            . ' WHERE ' . $this->identifier($this->definition['primary_key']) . ' = ?';
        $statement = $this->prepare($sql);
        $this->bind($statement, 's', array($id));
        if (!$statement->execute()) {
            $message = $statement->error;
            $statement->close();
            throw new RuntimeException($message ?: 'Data resource gagal dihapus.');
        }
        $deleted = $statement->affected_rows > 0;
        $statement->close();
        return $deleted;
    }

    /** @return array<int, string> */
    private function columns(): array
    {
        $table = $this->identifier($this->definition['table']);
        $result = $this->connection->query('SHOW COLUMNS FROM ' . $table);
        if (!$result) {
            throw new RuntimeException('Struktur resource tidak dapat dibaca.');
        }

        $columns = array();
        while ($row = $result->fetch_assoc()) {
            if (isset($row['Field']) && preg_match('/^[a-zA-Z0-9_]+$/', $row['Field'])) {
                $columns[] = $row['Field'];
            }
        }
        $result->free();
        if ($columns === array()) {
            throw new RuntimeException('Resource tidak memiliki kolom yang dapat dibaca.');
        }

        return $columns;
    }

    /** @param array<int, array<string, mixed>> $rows @return array<int, array<string, mixed>> */
    private function sanitizeRows(array $rows): array
    {
        foreach ($rows as &$row) {
            unset($row['password'], $row['password_hash']);
        }
        unset($row);
        return $rows;
    }

    /** @param array<string, mixed> $input @param array<int, string> $columns @return array<string, scalar|null> */
    private function filterInput(array $input, array $columns, bool $includePrimary = true): array
    {
        $allowed = array();
        foreach ($input as $key => $value) {
            if (!is_string($key) || !in_array($key, $columns, true)) {
                continue;
            }
            if (!$includePrimary && $key === $this->definition['primary_key']) {
                continue;
            }
            if (in_array($key, array('password', 'password_hash'), true)) {
                continue;
            }
            if (is_array($value) || is_object($value)) {
                continue;
            }
            $allowed[$key] = $value;
        }
        return $allowed;
    }

    /** @param array<int, scalar|null> $params @return array<int, array<string, mixed>> */
    private function fetchAll(string $sql, string $types, array $params): array
    {
        $statement = $this->prepare($sql);
        $this->bind($statement, $types, $params);
        if (!$statement->execute()) {
            $message = $statement->error;
            $statement->close();
            throw new RuntimeException($message ?: 'Query resource gagal dijalankan.');
        }
        $result = $statement->get_result();
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $statement->close();
        return $rows;
    }

    /** @param array<int, scalar|null> $params @return array<string, mixed>|null */
    private function fetchOne(string $sql, string $types, array $params): ?array
    {
        $rows = $this->fetchAll($sql, $types, $params);
        return $rows[0] ?? null;
    }

    private function prepare(string $sql): \mysqli_stmt
    {
        $statement = $this->connection->prepare($sql);
        if (!$statement) {
            throw new RuntimeException('Query resource tidak dapat disiapkan.');
        }
        return $statement;
    }

    /** @param array<int, scalar|null> $params */
    private function bind(\mysqli_stmt $statement, string $types, array $params): void
    {
        if ($params === array()) {
            return;
        }
        $references = array($types);
        foreach ($params as $index => $value) {
            $references[] = &$params[$index];
        }
        if (!call_user_func_array(array($statement, 'bind_param'), $references)) {
            throw new RuntimeException('Parameter resource tidak valid.');
        }
    }

    private function identifier(string $value): string
    {
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $value)) {
            throw new RuntimeException('Identifier resource tidak valid.');
        }
        return '`' . $value . '`';
    }
}
