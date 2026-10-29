// A tiny stand-in for the Supabase client, used only in tests.
// It answers the same calls the app makes and records every write so tests can check them.

type Row = Record<string, unknown>

export interface DbCall {
  table: string
  op: 'select' | 'insert' | 'update' | 'delete' | 'rpc'
  payload?: unknown
  filters: Record<string, unknown>
}

interface DbResult {
  data: unknown
  error: { message: string } | null
}

export interface FakeDbOptions {
  /** Row security hides updates and deletes: they "succeed" but touch no rows. */
  denyWrites?: boolean
  /** Make inserts fail with this message. */
  insertError?: string
  /** What each database function (rpc) returns. */
  rpcResults?: Record<string, unknown>
}

export function createFakeDb(tables: Record<string, Row[]>, options: FakeDbOptions = {}) {
  const calls: DbCall[] = []

  function from(table: string) {
    let op: DbCall['op'] = 'select'
    let payload: unknown
    let single = false
    const filters: Record<string, unknown> = {}

    function run(): DbResult {
      calls.push({ table, op, payload, filters: { ...filters } })

      if (op === 'insert') {
        return options.insertError
          ? { data: null, error: { message: options.insertError } }
          : { data: null, error: null }
      }
      if (op === 'update' || op === 'delete') {
        return { data: options.denyWrites ? [] : [{ id: filters.id }], error: null }
      }
      const rows = (tables[table] ?? []).filter((r) =>
        Object.entries(filters).every(([key, value]) => r[key] === value),
      )
      return { data: single ? (rows[0] ?? null) : rows, error: null }
    }

    const builder = {
      select: () => builder,
      order: () => builder,
      eq: (column: string, value: unknown) => {
        filters[column] = value
        return builder
      },
      maybeSingle: () => {
        single = true
        return builder
      },
      insert: (value: unknown) => {
        op = 'insert'
        payload = value
        return builder
      },
      update: (value: unknown) => {
        op = 'update'
        payload = value
        return builder
      },
      delete: () => {
        op = 'delete'
        return builder
      },
      then<A = DbResult, B = never>(
        onfulfilled?: ((value: DbResult) => A | PromiseLike<A>) | null,
        onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
      ): Promise<A | B> {
        return Promise.resolve(run()).then(onfulfilled, onrejected)
      },
    }
    return builder
  }

  function rpc(name: string, args: unknown) {
    calls.push({ table: name, op: 'rpc', payload: args, filters: {} })
    return Promise.resolve({ data: options.rpcResults?.[name] ?? null, error: null })
  }

  return { calls, from, rpc }
}

export type FakeDb = ReturnType<typeof createFakeDb>
