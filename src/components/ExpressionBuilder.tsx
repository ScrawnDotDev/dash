import { useState, useEffect } from "react"

type NodeType = "number" | "tag" | "expr" | "func" | "token"

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
const TOKEN_NAMES: TokenName[] = ["inputTokens", "outputTokens", "outputCacheTokens"]

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
      const args = node.args.filter(Boolean).map((a) => serialize(a!)).join(", ")
      return `${node.funcName}(${args})`
    }
  }
}

function validateNode(
  node: ExprNode | null,
  tags: string[],
  expressions: string[]
): string | null {
  if (!node) return "This slot is empty"

  switch (node.type) {
    case "number":
      return null
    case "tag":
      if (!tags.includes(node.tagName)) return `Tag "${node.tagName}" does not exist`
      return null
    case "expr":
      if (!expressions.includes(node.exprKey)) return `Expression "${node.exprKey}" does not exist`
      return null
    case "token":
      return null
    case "func": {
      if (node.args.length === 0) return "Function needs at least one argument"
      if ((node.funcName === "sub" || node.funcName === "div") && node.args.length !== 2)
        return `${node.funcName}() requires exactly 2 arguments`
      for (let i = 0; i < node.args.length; i++) {
        const err = validateNode(node.args[i], tags, expressions)
        if (err) return `Argument ${i + 1}: ${err}`
      }
      return null
    }
  }
}

function emptyNode(type: NodeType, tags: string[], expressions: string[]): ExprNode {
  switch (type) {
    case "number":
      return { type: "number", value: 0 }
    case "tag":
      return { type: "tag", tagName: tags[0] ?? "" }
    case "expr":
      return { type: "expr", exprKey: expressions[0] ?? "" }
    case "func":
      return { type: "func", funcName: "add", args: [null] }
    case "token":
      return { type: "token", tokenName: "inputTokens" }
  }
}

interface NodeEditorProps {
  node: ExprNode | null
  onChange: (node: ExprNode | null) => void
  tags: string[]
  expressions: string[]
  depth: number
  onRemove?: () => void
}

function NodeEditor({ node, onChange, tags, expressions, depth, onRemove }: NodeEditorProps) {
  const type = node?.type ?? null

  const setType = (t: NodeType) => {
    if (t === type) return
    onChange(emptyNode(t, tags, expressions))
  }

  return (
    <div className={`rounded-lg border ${depth > 0 ? "border-gray-700 bg-gray-900" : "border-gray-700 bg-gray-900"} p-3`}>
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {(["number", "tag", "expr", "func", "token"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded px-2 py-0.5 text-xs font-medium ${type === t ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-400 hover:text-gray-200"}`}
          >
            {t === "func" ? "Function" : t === "token" ? "Token" : t}
          </button>
        ))}
        {onRemove && (
          <button type="button" onClick={onRemove} className="ml-auto rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-900">
            Remove
          </button>
        )}
      </div>

      {type === "number" && (
        <input
          type="number"
          value={(node as ExprNode & { type: "number" }).value}
          onChange={(e) => onChange({ type: "number", value: parseInt(e.target.value) || 0 })}
          className="w-full rounded border border-gray-700 bg-transparent px-2 py-1 text-sm"
        />
      )}

      {type === "tag" && (
        <select
          value={(node as ExprNode & { type: "tag" }).tagName}
          onChange={(e) => onChange({ type: "tag", tagName: e.target.value })}
          className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm"
        >
          {tags.length === 0 && <option value="">No tags available</option>}
          {tags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      )}

      {type === "expr" && (
        <select
          value={(node as ExprNode & { type: "expr" }).exprKey}
          onChange={(e) => onChange({ type: "expr", exprKey: e.target.value })}
          className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm"
        >
          {expressions.length === 0 && <option value="">No expressions available</option>}
          {expressions.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      )}

      {type === "token" && (
        <select
          value={(node as ExprNode & { type: "token" }).tokenName}
          onChange={(e) => onChange({ type: "token", tokenName: e.target.value as TokenName })}
          className="w-full rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm"
        >
          {TOKEN_NAMES.map((t) => (
            <option key={t} value={t}>{t}()</option>
          ))}
        </select>
      )}

      {type === "func" && (
        <>
          <div className="mb-2 flex gap-1.5">
            {FUNC_NAMES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  const fn = node as FuncNode
                  const newArgs = f === "sub" || f === "div" ? [fn.args[0] ?? null, fn.args[1] ?? null] : fn.args
                  onChange({ type: "func", funcName: f, args: newArgs.length > 0 ? newArgs : [null] })
                }}
                className={`rounded px-2 py-0.5 text-xs font-mono font-medium ${(node as FuncNode).funcName === f ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-400 hover:text-gray-200"}`}
              >
                {f}()
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {(node as FuncNode).args.map((arg, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-2 min-w-12 text-xs text-gray-500">Arg {i + 1}</span>
                <div className="flex-1">
                  <NodeEditor
                    node={arg}
                    onChange={(newArg) => {
                      const fn = node as FuncNode
                      const args = [...fn.args]
                      args[i] = newArg
                      onChange({ ...fn, args })
                    }}
                    tags={tags}
                    expressions={expressions}
                    depth={depth + 1}
                    onRemove={
                      ((node as FuncNode).funcName === "add" || (node as FuncNode).funcName === "mul") && (node as FuncNode).args.length > 1
                        ? () => {
                            const fn = node as FuncNode
                            const args = fn.args.filter((_, idx) => idx !== i)
                            onChange({ ...fn, args })
                          }
                        : undefined
                    }
                  />
                </div>
              </div>
            ))}
            {((node as FuncNode).funcName === "add" || (node as FuncNode).funcName === "mul") && (
              <button
                type="button"
                onClick={() => {
                  const fn = node as FuncNode
                  onChange({ ...fn, args: [...fn.args, null] })
                }}
                className="self-start rounded border border-dashed border-gray-600 px-3 py-1 text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200"
              >
                + Add Argument
              </button>
            )}
          </div>
        </>
      )}
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

export function ExpressionBuilder({ tags, expressions, onChange, onError, onSaveExpression }: ExpressionBuilderProps) {
  const [root, setRoot] = useState<ExprNode | null>(null)
  const [exprKey, setExprKey] = useState("")

  useEffect(() => {
    if (!root) {
      onChange?.( "")
      onError(null)
      return
    }
    const err = validateNode(root, tags, expressions)
    onError(err)

    if (!err) {
      onChange?.(serialize(root))
    }
  }, [root, tags, expressions, onChange, onError])

  return (
    <div className="flex flex-col gap-3">
      {!root ? (
        <div className="flex flex-wrap gap-2">
          {(["number", "tag", "expr", "func", "token"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setRoot(emptyNode(t, tags, expressions))}
              className="rounded-lg border border-dashed border-gray-600 px-4 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-gray-200"
            >
              {t === "number" ? "Number" : t === "tag" ? "Tag" : t === "expr" ? "Expression" : t === "func" ? "Function" : "Token"}
            </button>
          ))}
        </div>
      ) : (
        <>
          <NodeEditor
            node={root}
            onChange={(n) => setRoot(n)}
            tags={tags}
            expressions={expressions}
            depth={0}
            onRemove={() => setRoot(null)}
          />

          <div className="rounded bg-gray-950 px-3 py-2 font-mono text-xs text-gray-400">
            Result: {serialize(root)}
          </div>

          {onSaveExpression && (
            <div className="flex gap-2">
              <input
                value={exprKey}
                onChange={(e) => setExprKey(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
                placeholder="EXPR_NAME"
                required
                className="w-40 rounded-lg border border-gray-700 bg-transparent px-3 py-2 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (exprKey && serialize(root)) {
                    onSaveExpression(exprKey, serialize(root))
                    setExprKey("")
                    setRoot(null)
                  }
                }}
                disabled={!exprKey || !!validateNode(root, tags, expressions)}
                className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Expression
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
