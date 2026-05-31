import { useState, useEffect } from "react"

type FuncName = "add" | "sub" | "mul" | "div"

type TokenName = "inputTokens" | "outputTokens" | "outputCacheTokens"

interface FuncNode {
  type: "func"
  funcName: FuncName
  args: (ExprNode | null)[]
}

type ExprNode =
  | { type: "number"; value: number }
  | { type: "tag"; tagName: string }
  | { type: "expr"; exprKey: string }
  | FuncNode
  | { type: "token"; tokenName: TokenName }

const FUNC_NAMES: FuncName[] = ["add", "sub", "mul", "div"]
const TOKEN_NAMES: TokenName[] = [
  "inputTokens",
  "outputTokens",
  "outputCacheTokens",
]

const FUNC_DESCRIPTIONS: Record<string, string> = {
  add: "Sum of values",
  mul: "Multiply values together",
  sub: "Subtract one from another",
  div: "Divide one by another",
}

const ARG_LABELS: Record<string, (i: number) => string> = {
  add: (i: number) => `Value ${i + 1}`,
  mul: (i: number) => `Factor ${i + 1}`,
  sub: (i: number) => (i === 0 ? "From" : "Subtract"),
  div: (i: number) => (i === 0 ? "Dividend" : "Divisor"),
}

function serialize(node: ExprNode): string {
  switch (node.type) {
    case "number":
      return String(node.value)
    case "tag":
      return `tag(${node.tagName})`
    case "expr":
      return `expr(${node.exprKey})`
    case "token":
      return `${node.tokenName}()`
    case "func": {
      const args = node.args
        .filter(Boolean)
        .map((a) => serialize(a!))
        .join(", ")
      return `${node.funcName}(${args})`
    }
  }
}

function validateNode(
  node: ExprNode | null,
  tags: string[],
  expressions: string[]
): string | null {
  if (!node) return "This value is missing"

  switch (node.type) {
    case "number":
    case "token":
      return null
    case "tag":
      if (!tags.includes(node.tagName))
        return `Tag "${node.tagName}" does not exist`
      return null
    case "expr":
      if (!expressions.includes(node.exprKey))
        return `Expression "${node.exprKey}" does not exist`
      return null
    case "func": {
      if (node.args.length === 0) return "Need at least one value"
      if (
        (node.funcName === "sub" || node.funcName === "div") &&
        node.args.length !== 2
      )
        return `${node.funcName}() needs exactly 2 values`
      for (let i = 0; i < node.args.length; i++) {
        const err = validateNode(node.args[i], tags, expressions)
        if (err) return `${ARG_LABELS[node.funcName](i)}: ${err}`
      }
      return null
    }
  }
}

function newFunc(name: FuncName): FuncNode {
  const argCount = name === "sub" || name === "div" ? 2 : 1
  return { type: "func", funcName: name, args: Array(argCount).fill(null) }
}

interface ArgSlotProps {
  node: ExprNode | null
  onChange: (n: ExprNode | null) => void
  tags: string[]
  expressions: string[]
  label: string
  onRemove?: () => void
}

function ArgSlot({
  node,
  onChange,
  tags,
  expressions,
  label,
  onRemove,
}: ArgSlotProps) {
  const type = node?.type ?? null

  const pickType = (t: "number" | "tag" | "expr" | "token" | "func") => {
    if (type === t) return
    switch (t) {
      case "number":
        onChange({ type: "number", value: 0 })
        break
      case "tag":
        onChange({ type: "tag", tagName: tags[0] ?? "" })
        break
      case "expr":
        onChange({ type: "expr", exprKey: expressions[0] ?? "" })
        break
      case "token":
        onChange({ type: "token", tokenName: "inputTokens" })
        break
      case "func":
        onChange(newFunc("add"))
        break
    }
  }

  return (
    <div className="border-2 border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <div className="mb-4 flex items-center gap-4">
        <span className="bg-black px-2 py-1 font-mono text-xs font-black text-white uppercase dark:bg-white dark:text-black">
          {label}
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto border-2 border-transparent px-2 py-1 font-mono text-xs font-black text-red-600 uppercase transition-colors hover:border-black hover:bg-red-600 hover:text-white dark:hover:border-white"
          >
            REMOVE
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["number", "tag", "expr", "token", "func"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => pickType(t)}
            className={`border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase transition-all dark:border-white ${
              type === t
                ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-white dark:text-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                : "bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800"
            }`}
          >
            {t === "func"
              ? "Sub-op"
              : t === "expr"
                ? "Expr"
                : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {type === "number" && (
        <input
          type="number"
          value={(node as ExprNode & { type: "number" }).value}
          onChange={(e) =>
            onChange({ type: "number", value: parseInt(e.target.value) || 0 })
          }
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none dark:border-white"
        />
      )}

      {type === "tag" && (
        <select
          value={(node as ExprNode & { type: "tag" }).tagName}
          onChange={(e) => onChange({ type: "tag", tagName: e.target.value })}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
        >
          {tags.length === 0 && <option value="">No tags</option>}
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}

      {type === "expr" && (
        <select
          value={(node as ExprNode & { type: "expr" }).exprKey}
          onChange={(e) => onChange({ type: "expr", exprKey: e.target.value })}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
        >
          {expressions.length === 0 && <option value="">No expressions</option>}
          {expressions.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      )}

      {type === "token" && (
        <select
          value={(node as ExprNode & { type: "token" }).tokenName}
          onChange={(e) =>
            onChange({ type: "token", tokenName: e.target.value as TokenName })
          }
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
        >
          {TOKEN_NAMES.map((t) => (
            <option key={t} value={t}>
              {t}()
            </option>
          ))}
        </select>
      )}

      {type === "func" && (
        <div className="mt-4 border-t-2 border-dashed border-black pt-4 dark:border-white">
          <FuncBuilder
            node={node as FuncNode}
            onChange={(n) => onChange(n)}
            tags={tags}
            expressions={expressions}
          />
        </div>
      )}
    </div>
  )
}

interface FuncBuilderProps {
  node: FuncNode
  onChange: (n: FuncNode) => void
  tags: string[]
  expressions: string[]
}

function FuncBuilder({ node, onChange, tags, expressions }: FuncBuilderProps) {
  const labels = ARG_LABELS[node.funcName]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {FUNC_NAMES.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              const newArgs =
                f === "sub" || f === "div"
                  ? [node.args[0] ?? null, node.args[1] ?? null]
                  : node.args
              onChange({
                type: "func",
                funcName: f,
                args: newArgs.length > 0 ? newArgs : [null],
              })
            }}
            className={`border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase transition-all dark:border-white ${
              node.funcName === f
                ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-white dark:text-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                : "bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {FUNC_DESCRIPTIONS[node.funcName]}
      </p>

      {node.args.map((arg, i) => (
        <ArgSlot
          key={i}
          node={arg}
          onChange={(newArg) => {
            const args = [...node.args]
            args[i] = newArg
            onChange({ ...node, args })
          }}
          tags={tags}
          expressions={expressions}
          label={labels(i)}
          onRemove={
            (node.funcName === "add" || node.funcName === "mul") &&
            node.args.length > 1
              ? () =>
                  onChange({
                    ...node,
                    args: node.args.filter((_, idx) => idx !== i),
                  })
              : undefined
          }
        />
      ))}

      {(node.funcName === "add" || node.funcName === "mul") && (
        <button
          type="button"
          onClick={() => onChange({ ...node, args: [...node.args, null] })}
          className="self-start border-2 border-dashed border-black px-4 py-2 font-mono text-xs font-black text-black uppercase transition-all hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          + ADD VALUE
        </button>
      )}
    </div>
  )
}

interface SingleValueSelectorProps {
  tags: string[]
  expressions: string[]
  onPick: (node: ExprNode) => void
}

function SingleValueSelector({
  tags,
  expressions,
  onPick,
}: SingleValueSelectorProps) {
  const [st, setSt] = useState<"number" | "tag" | "expr" | "token">("number")
  const [val, setVal] = useState<string | number>(0)

  return (
    <div className="border-2 border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <div className="mb-4 flex flex-wrap gap-2">
        {(["number", "tag", "expr", "token"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setSt(t)
              setVal(t === "number" ? 0 : t === "token" ? "inputTokens" : "")
            }}
            className={`border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase transition-all dark:border-white ${
              st === t
                ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-white dark:text-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                : "bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800"
            }`}
          >
            {t === "expr" ? "Expr" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {st === "number" && (
        <input
          type="number"
          value={val as number}
          onChange={(e) => setVal(parseInt(e.target.value) || 0)}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none dark:border-white"
        />
      )}

      {st === "tag" && (
        <select
          value={val as string}
          onChange={(e) => setVal(e.target.value)}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
        >
          {tags.length === 0 && <option value="">No tags</option>}
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}

      {st === "expr" && (
        <select
          value={val as string}
          onChange={(e) => setVal(e.target.value)}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
        >
          {expressions.length === 0 && <option value="">No expressions</option>}
          {expressions.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      )}

      {st === "token" && (
        <select
          value={val as string}
          onChange={(e) => setVal(e.target.value)}
          className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
        >
          {TOKEN_NAMES.map((t) => (
            <option key={t} value={t}>
              {t}()
            </option>
          ))}
        </select>
      )}

      <button
        type="button"
        onClick={() => {
          if (st === "number") onPick({ type: "number", value: val as number })
          else if (st === "tag") onPick({ type: "tag", tagName: val as string })
          else if (st === "expr")
            onPick({ type: "expr", exprKey: val as string })
          else onPick({ type: "token", tokenName: val as TokenName })
        }}
        className="mt-4 border-2 border-black bg-[#ff00ff] px-4 py-2 font-mono text-sm font-black text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
      >
        USE THIS
      </button>
    </div>
  )
}

interface ExpressionBuilderProps {
  tags: string[]
  expressions: string[]
  onChange?: (expr: string) => void
  onError: (error: string | null) => void
  onSaveExpression?: (key: string, expr: string) => void
}

export function ExpressionBuilder({
  tags,
  expressions,
  onChange,
  onError,
  onSaveExpression,
}: ExpressionBuilderProps) {
  const [root, setRoot] = useState<ExprNode | null>(null)
  const [singleMode, setSingleMode] = useState(false)
  const [exprKey, setExprKey] = useState("")

  const result = root ? serialize(root) : ""

  useEffect(() => {
    if (!root) {
      onChange?.("")
      onError(null)
      return
    }
    const err = validateNode(root, tags, expressions)
    onError(err)
    if (!err) onChange?.(serialize(root))
  }, [root, tags, expressions, onChange, onError])

  function handleSave() {
    const r = root
    if (r && exprKey && !validateNode(r, tags, expressions)) {
      onSaveExpression?.(exprKey, serialize(r))
      setExprKey("")
      setRoot(null)
      setSingleMode(false)
    }
  }

  if (!root && !singleMode) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-mono text-sm font-black text-black uppercase dark:text-white">
          Choose how to build your expression:
        </p>
        <div className="flex flex-wrap gap-4">
          {FUNC_NAMES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setRoot(newFunc(f))}
              className="border-2 border-black bg-white px-4 py-3 text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
            >
              <span className="font-mono text-lg font-black text-black dark:text-white">
                {f}()
              </span>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {FUNC_DESCRIPTIONS[f]}
              </p>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSingleMode(true)}
          className="w-max border-b-2 border-black pb-0.5 font-mono text-xs font-black text-black uppercase transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          OR USE A SINGLE VALUE (NUMBER, TAG, EXPRESSION, TOKEN)
        </button>
      </div>
    )
  }

  if (singleMode && !root) {
    return (
      <div className="flex flex-col gap-4">
        <SingleValueSelector
          tags={tags}
          expressions={expressions}
          onPick={(n) => {
            setRoot(n)
            setSingleMode(false)
          }}
        />
        <button
          type="button"
          onClick={() => setSingleMode(false)}
          className="w-max border-b-2 border-black pb-0.5 font-mono text-xs font-black text-black uppercase transition-colors hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
          BACK TO FUNCTION BUILDER
        </button>
      </div>
    )
  }

  const r = root!

  return (
    <div className="flex flex-col gap-6">
      <div className="border-2 border-black bg-[#ff00ff] px-4 py-3 font-mono text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
        RESULT: {result}
      </div>

      {r.type === "func" ? (
        <FuncBuilder
          node={r}
          onChange={setRoot}
          tags={tags}
          expressions={expressions}
        />
      ) : (
        <div className="border-2 border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <div className="mb-4 flex items-center gap-4">
            <span className="bg-black px-2 py-1 font-mono text-xs font-black text-white uppercase dark:bg-white dark:text-black">
              SINGLE VALUE
            </span>
            <button
              type="button"
              onClick={() => setRoot(null)}
              className="ml-auto border-2 border-transparent px-2 py-1 font-mono text-xs font-black text-red-600 uppercase transition-colors hover:border-black hover:bg-red-600 hover:text-white dark:hover:border-white"
            >
              REMOVE
            </button>
          </div>
          {r.type === "number" && (
            <input
              type="number"
              value={r.value}
              onChange={(e) =>
                setRoot({
                  type: "number",
                  value: parseInt(e.target.value) || 0,
                })
              }
              className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none dark:border-white"
            />
          )}
          {r.type === "tag" && (
            <select
              value={r.tagName}
              onChange={(e) =>
                setRoot({ type: "tag", tagName: e.target.value })
              }
              className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
            >
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
          {r.type === "expr" && (
            <select
              value={r.exprKey}
              onChange={(e) =>
                setRoot({ type: "expr", exprKey: e.target.value })
              }
              className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
            >
              {expressions.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          )}
          {r.type === "token" && (
            <select
              value={r.tokenName}
              onChange={(e) =>
                setRoot({
                  type: "token",
                  tokenName: e.target.value as TokenName,
                })
              }
              className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none dark:border-white"
            >
              {TOKEN_NAMES.map((t) => (
                <option key={t} value={t}>
                  {t}()
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {onSaveExpression && (
        <div className="flex gap-4">
          <input
            value={exprKey}
            onChange={(e) =>
              setExprKey(
                e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "")
              )
            }
            placeholder="EXPR_NAME"
            required
            className="w-48 border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all outline-none focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none dark:border-white"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!exprKey || !!validateNode(r, tags, expressions)}
            className="border-2 border-black bg-black px-6 py-2 font-mono text-sm font-black text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
          >
            SAVE EXPRESSION
          </button>
        </div>
      )}
    </div>
  )
}
