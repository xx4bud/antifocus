#!/usr/bin/env tsx

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// ============================================================================
// TYPES
// ============================================================================

type SchemaModule = {
  name: string;
  dbSchemaPath: string;
  configSchemaPath: string;
  tables: string[];
  enums: string[];
};

type GenerateOptions = {
  module?: string;
  all?: boolean;
  output?: string;
  dryRun?: boolean;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const ROOT_DIR = resolve(import.meta.dirname, "../../..");
const DB_SCHEMAS_DIR = join(ROOT_DIR, "packages/db/src");
const CONFIG_SCHEMAS_DIR = join(ROOT_DIR, "packages/config/src/schemas");

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Discover all available schema modules
 */
function discoverModules(): SchemaModule[] {
  const modules: SchemaModule[] = [];
  const dirs = readdirSync(DB_SCHEMAS_DIR, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory()) {
      continue;
    }
    if (dir.name === "index.ts") {
      continue;
    }

    const schemaPath = join(DB_SCHEMAS_DIR, dir.name, "schema.ts");
    if (!existsSync(schemaPath)) {
      continue;
    }

    const module: SchemaModule = {
      name: dir.name,
      dbSchemaPath: schemaPath,
      configSchemaPath: join(CONFIG_SCHEMAS_DIR, `${dir.name}.ts`),
      tables: [],
      enums: [],
    };

    // Parse the schema file to extract exports
    const content = readFileSync(schemaPath, "utf-8");
    const exports = extractExports(content);
    module.tables = exports.tables;
    module.enums = exports.enums;

    modules.push(module);
  }

  return modules;
}

/**
 * Extract table and enum exports from schema file
 */
function extractExports(content: string): {
  tables: string[];
  enums: string[];
} {
  const tables: string[] = [];
  const enums: string[] = [];

  // Match: export const tableName = pgTable(...)
  const tableRegex = /export const (\w+) = pgTable\(/g;
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(content)) !== null) {
    if (match[1]) {
      tables.push(match[1]);
    }
  }

  // Match: export const enumName = pgEnum(...)
  const enumRegex = /export const (\w+) = pgEnum\(/g;
  while ((match = enumRegex.exec(content)) !== null) {
    if (match[1]) {
      enums.push(match[1]);
    }
  }

  return { tables, enums };
}

/**
 * Convert snake_case or camelCase to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split(/[_\s-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Convert PascalCase to camelCase
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Generate pluralized type name for data
 */
function toDataTypeName(tableName: string): string {
  const pascal = toPascalCase(tableName);
  // Simple pluralization - just add 'Data'
  return `${pascal}Data`;
}

/**
 * Generate insert type name
 */
function toInsertTypeName(tableName: string): string {
  const pascal = toPascalCase(tableName);
  return `Insert${pascal}`;
}

/**
 * Generate update type name
 */
function toUpdateTypeName(tableName: string): string {
  const pascal = toPascalCase(tableName);
  return `Update${pascal}`;
}

// ============================================================================
// CODE GENERATION
// ============================================================================

/**
 * Generate the complete schema file content
 */
function generateSchemaFile(module: SchemaModule): string {
  const allExports = [...module.enums, ...module.tables];
  const lines: string[] = [];

  // Header: Imports
  lines.push("import {");
  for (const exportName of allExports) {
    lines.push(`  ${exportName},`);
  }
  lines.push(`} from "@antifocus/db/${module.name}/schema";`);
  lines.push(
    'import { createSelectSchema, createInsertSchema } from "drizzle-zod";'
  );
  lines.push('import type { z } from "zod/v4-mini";');
  lines.push("");

  // Section: SELECT SCHEMAS
  lines.push(
    "// ============================================================================"
  );
  lines.push("// SELECT SCHEMAS");
  lines.push(
    "// ============================================================================"
  );
  lines.push("");

  for (const exportName of allExports) {
    const schemaName = `${toCamelCase(exportName)}Schema`;
    const typeName = toDataTypeName(exportName);

    lines.push(
      `export const ${schemaName} = createSelectSchema(${exportName});`
    );
    lines.push("");
    lines.push(`export type ${typeName} = z.infer<typeof ${schemaName}>;`);
    lines.push("");
  }

  // Section: INSERT SCHEMAS (only for tables, not enums)
  if (module.tables.length > 0) {
    lines.push(
      "// ============================================================================"
    );
    lines.push("// INSERT SCHEMAS");
    lines.push(
      "// ============================================================================"
    );
    lines.push("");

    for (const tableName of module.tables) {
      const schemaName = `insert${toPascalCase(tableName)}Schema`;
      const typeName = toInsertTypeName(tableName);

      lines.push(
        `export const ${schemaName} = createInsertSchema(${tableName});`
      );
      lines.push("");
      lines.push(`export type ${typeName} = z.infer<typeof ${schemaName}>;`);
      lines.push("");
    }

    // Section: UPDATE SCHEMAS (partial insert)
    lines.push(
      "// ============================================================================"
    );
    lines.push("// UPDATE SCHEMAS");
    lines.push(
      "// ============================================================================"
    );
    lines.push("");

    for (const tableName of module.tables) {
      const insertSchemaName = `insert${toPascalCase(tableName)}Schema`;
      const updateSchemaName = `update${toPascalCase(tableName)}Schema`;
      const typeName = toUpdateTypeName(tableName);

      lines.push(
        `export const ${updateSchemaName} = ${insertSchemaName}.partial();`
      );
      lines.push("");
      lines.push(
        `export type ${typeName} = z.infer<typeof ${updateSchemaName}>;`
      );
      lines.push("");
    }
  }

  return lines.join("\n");
}

/**
 * Generate schema for a specific module
 */
function generateModule(module: SchemaModule, options: GenerateOptions): void {
  console.log(`\n📦 Generating schemas for module: ${module.name}`);
  console.log(`   Tables: ${module.tables.length}`);
  console.log(`   Enums: ${module.enums.length}`);

  const content = generateSchemaFile(module);

  const outputPath = options.output
    ? join(options.output, `${module.name}.ts`)
    : module.configSchemaPath;

  if (options.dryRun) {
    console.log(`\n🔍 DRY RUN - Would write to: ${outputPath}`);
    console.log("─".repeat(80));
    console.log(content);
    console.log("─".repeat(80));
  } else {
    writeFileSync(outputPath, content, "utf-8");
    console.log(`✅ Generated: ${outputPath}`);
  }
}

// ============================================================================
// CLI
// ============================================================================

function printHelp(): void {
  console.log(`
📝 Drizzle Zod Schema Generator

Usage:
  pnpm gen:schemas [options]

Options:
  --module <name>    Generate schemas for a specific module (e.g., analytics)
  --all              Generate schemas for all modules
  --output <path>    Custom output directory (default: packages/config/src/schemas)
  --dry-run          Preview output without writing files
  --help             Show this help message

Examples:
  # Generate schemas for analytics module
  pnpm gen:schemas --module analytics

  # Generate schemas for all modules
  pnpm gen:schemas --all

  # Preview what would be generated
  pnpm gen:schemas --module auth --dry-run
  `);
}

function parseArgs(args: string[]): GenerateOptions {
  const options: GenerateOptions = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (!arg) {
      continue;
    }

    if (arg === "--module") {
      i += 1;
      const moduleArg = args[i];
      if (!moduleArg) {
        console.error("❌ --module requires a module name");
        process.exit(1);
      }
      options.module = moduleArg;
    } else if (arg === "--all") {
      options.all = true;
    } else if (arg === "--output") {
      i += 1;
      const outputArg = args[i];
      if (!outputArg) {
        console.error("❌ --output requires a path");
        process.exit(1);
      }
      options.output = outputArg;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--help") {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith("--")) {
      console.error(`❌ Unknown option: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  return options;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const options = parseArgs(args);

  console.log("🚀 Drizzle Zod Schema Generator");
  console.log("─".repeat(80));

  // Discover available modules
  const modules = discoverModules();
  console.log(`\n📂 Found ${modules.length} schema modules:`);
  for (const mod of modules) {
    console.log(`   - ${mod.name}`);
  }

  // Generate based on options
  if (options.all) {
    console.log("\n🔄 Generating schemas for ALL modules...");
    for (const module of modules) {
      generateModule(module, options);
    }
  } else if (options.module) {
    const module = modules.find((m) => m.name === options.module);
    if (!module) {
      console.error(`\n❌ Module not found: ${options.module}`);
      console.error(
        `   Available modules: ${modules.map((m) => m.name).join(", ")}`
      );
      process.exit(1);
    }
    generateModule(module, options);
  }

  console.log("\n✨ Done!");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
