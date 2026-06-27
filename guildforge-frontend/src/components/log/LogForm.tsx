import { type FormEvent, useState } from "react";

type Props = {
  onSubmit: (description: string, data?: Record<string, unknown> | null) => Promise<void>;
  disabled?: boolean;
};

export function LogForm({ onSubmit, disabled }: Props) {
  const [description, setDescription] = useState("");
  const [dataJson, setDataJson] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    let data: Record<string, unknown> | null = null;
    const raw = dataJson.trim();
    if (raw) {
      try {
        data = JSON.parse(raw) as Record<string, unknown>;
        if (data === null || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("Data must be a JSON object");
        }
      } catch {
        setError("Optional data must be valid JSON object syntax");
        return;
      }
    }
    setSaving(true);
    try {
      await onSubmit(description, data);
      setDescription("");
      setDataJson("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save log");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <label className="field">
        <span>Description</span>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="cooked pasta, ran 5km, read 50 pages…"
          required
        />
      </label>
      <label className="field">
        <span>Extra data (optional JSON)</span>
        <textarea
          rows={3}
          value={dataJson}
          onChange={(e) => setDataJson(e.target.value)}
          placeholder='{"cuisine": "Italian", "technique": "boiling"}'
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={disabled || saving || !description.trim()}>
        {saving ? "Saving…" : "Post log"}
      </button>
    </form>
  );
}
