import type { PgColumn, PgTableWithColumns, TableConfig } from "@antifocus/db";
import {
  and,
  eq,
  gt,
  gte,
  inArray,
  lt,
  lte,
  ne,
  not,
  or,
  type SQL,
} from "@antifocus/db";
import { rulesToAST } from "@casl/ability/extra";
import { CompoundCondition, type Condition, FieldCondition } from "@ucast/core";
import type { User } from ".";
import { getUserPermissions } from "./permissions";

export function drizzleWhere<T extends TableConfig>(
  action: Parameters<ReturnType<typeof getUserPermissions>["rulesFor"]>[0],
  subject: Parameters<ReturnType<typeof getUserPermissions>["rulesFor"]>[1],
  user: User | undefined,
  table: PgTableWithColumns<T>
): SQL | undefined {
  const ast = rulesToAST(getUserPermissions(user), action, subject);

  if (ast === null) {
    return;
  }

  return getConditionSql(ast, table);
}

function getConditionSql<T extends TableConfig>(
  condition: Condition,
  table: PgTableWithColumns<T>
): SQL | undefined {
  if (condition instanceof CompoundCondition) {
    switch (condition.operator) {
      case "and":
        return drizzleAnd(condition, table);
      case "or":
        return drizzleOr(condition, table);
      case "nor": {
        const orCondition = drizzleOr(condition, table);
        return orCondition ? not(orCondition) : undefined;
      }
      default: {
        throw new Error(
          `Unsupported compound condition operator: ${condition.operator}`
        );
      }
    }
  }

  if (condition instanceof FieldCondition) {
    switch (condition.operator) {
      case "eq": {
        return drizzleEq(condition, table);
      }
      case "ne": {
        return drizzleNe(condition, table);
      }
      case "in": {
        return drizzleIn(condition, table);
      }
      case "nin": {
        return drizzleNin(condition, table);
      }
      case "gt": {
        return drizzleGt(condition, table);
      }
      case "gte": {
        return drizzleGte(condition, table);
      }
      case "lt": {
        return drizzleLt(condition, table);
      }
      case "lte": {
        return drizzleLte(condition, table);
      }
      default: {
        throw new Error(
          `Unsupported field condition operator: ${condition.operator}`
        );
      }
    }
  }
}

function drizzleEq<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return eq(getColumn(table, condition.field as string), condition.value);
}

function drizzleNe<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return ne(getColumn(table, condition.field as string), condition.value);
}

function drizzleIn<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return inArray(
    getColumn(table, condition.field as string),
    condition.value as unknown[]
  );
}

function drizzleNin<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return not(
    inArray(
      getColumn(table, condition.field as string),
      condition.value as unknown[]
    )
  );
}

function drizzleGt<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return gt(getColumn(table, condition.field as string), condition.value);
}

function drizzleGte<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return gte(getColumn(table, condition.field as string), condition.value);
}

function drizzleLt<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return lt(getColumn(table, condition.field as string), condition.value);
}

function drizzleLte<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
): SQL {
  return lte(getColumn(table, condition.field as string), condition.value);
}

function drizzleAnd<T extends TableConfig>(
  condition: CompoundCondition,
  table: PgTableWithColumns<T>
): SQL | undefined {
  const conditions = condition.value
    .map((cond) => getConditionSql(cond, table))
    .filter((sql): sql is SQL => sql !== undefined);

  if (conditions.length === 0) {
    return;
  }

  return and(...conditions);
}

function drizzleOr<T extends TableConfig>(
  condition: CompoundCondition,
  table: PgTableWithColumns<T>
): SQL | undefined {
  const conditions = condition.value
    .map((cond) => getConditionSql(cond, table))
    .filter((sql): sql is SQL => sql !== undefined);

  if (conditions.length === 0) {
    return;
  }

  return or(...conditions);
}

function getColumn<T extends TableConfig>(
  table: PgTableWithColumns<T>,
  field: string
): PgColumn {
  const column = table[field as keyof typeof table] as PgColumn | undefined;
  if (!column) {
    throw new Error(`Column ${field} not found in table`);
  }
  return column;
}
