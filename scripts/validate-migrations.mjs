import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const migrationsDir = join(process.cwd(), "supabase/migrations");
const sql = readdirSync(migrationsDir)
  .filter((fileName) => fileName.endsWith(".sql"))
  .sort()
  .map((fileName) => readFileSync(join(migrationsDir, fileName), "utf8"))
  .join("\n\n")
  .toLowerCase();

const tables = [
  "profiles",
  "customers",
  "products",
  "orders",
  "order_items",
  "follow_ups"
];
const actions = ["select", "insert", "update", "delete"];

const failures = [];

for (const table of tables) {
  const createTableStart = sql.indexOf(`create table public.${table}`);
  const createTableEnd = sql.indexOf(");", createTableStart);
  const createTableSql =
    createTableStart >= 0 && createTableEnd >= 0
      ? sql.slice(createTableStart, createTableEnd)
      : "";

  if (!sql.includes(`create table public.${table}`)) {
    failures.push(`Tabela ausente: ${table}`);
  }

  if (!sql.includes(`alter table public.${table} enable row level security`)) {
    failures.push(`RLS ausente: ${table}`);
  }

  if (!createTableSql.includes("id uuid primary key")) {
    failures.push(`Primary key id uuid ausente: ${table}`);
  }

  if (
    !/user_id\s+uuid\s+not\s+null[\s\S]*default\s+auth\.uid\(\)/.test(
      createTableSql
    )
  ) {
    failures.push(`Coluna user_id obrigatoria nao encontrada para ${table}`);
  }

  if (
    !createTableSql.includes("created_at timestamptz not null default now()")
  ) {
    failures.push(`created_at obrigatorio ausente: ${table}`);
  }

  if (
    !createTableSql.includes("updated_at timestamptz not null default now()")
  ) {
    failures.push(`updated_at obrigatorio ausente: ${table}`);
  }

  for (const action of actions) {
    if (!sql.includes(`on public.${table}\nfor ${action}`)) {
      failures.push(`Policy ${action.toUpperCase()} ausente: ${table}`);
    }
  }
}

const requiredSnippets = [
  "with check (user_id = auth.uid())",
  "using (user_id = auth.uid())",
  "orders_payment_status_check",
  "orders_delivery_status_check",
  "follow_ups_type_check",
  "follow_ups_status_check",
  "profiles_id_matches_user_id_check",
  "add column birthday date",
  "add column tags text[]",
  "add column category text",
  "set_updated_at()"
];

for (const snippet of requiredSnippets) {
  if (!sql.includes(snippet)) {
    failures.push(`Trecho obrigatorio ausente: ${snippet}`);
  }
}

if (failures.length > 0) {
  console.error("Validacao de migrations falhou:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (sql.includes("using (true)") || sql.includes("with check (true)")) {
  console.error("Validacao de migrations falhou:");
  console.error("- Policy global detectada via true");
  process.exit(1);
}

console.log(
  "Migration validada: tabelas, RLS, policies e constraints presentes."
);
