import { useEffect, useState } from "react";
import { useAuth } from "../3_context/AuthContext.jsx";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../6_services/transactionService.js";

export default function Transactions() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [items, setItems] = useState([]);

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Épicerie");
  const [type, setType] = useState("expense");
  const [busy, setBusy] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");

  const load = async () => {
    if (!uid) return;
    const data = await getTransactions(uid);
    setItems(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!uid) return;

    setBusy(true);
    try {
      await createTransaction(uid, {
        label: label.trim(),
        amount: Number(amount),
        category,
        type,
      });
      setLabel("");
      setAmount("");
      await load();
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    if (!uid) return;
    await deleteTransaction(uid, id);
    await load();
  };

  const startEdit = (tx) => {
    setEditingId(tx.id);
    setEditAmount(tx.amount ?? "");
  };

  const saveEdit = async (id) => {
    if (!uid) return;

    await updateTransaction(uid, id, {
      amount: Number(editAmount),
    });

    setEditingId(null);
    await load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
  };

  return (
    <div className="section">
      <h1 className="title">Transactions</h1>

      <form onSubmit={onCreate} className="box" style={{ maxWidth: 520 }}>
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <input
              className="input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Metro, IGA, Salaire…"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Montant</label>
          <div className="control">
            <input
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="columns">
          <div className="column">
            <label className="label">Type</label>
            <div className="select is-fullwidth">
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
              </select>
            </div>
          </div>

          <div className="column">
            <label className="label">Catégorie</label>
            <div className="select is-fullwidth">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Épicerie</option>
                <option>Transport</option>
                <option>Loisirs</option>
                <option>Factures</option>
                <option>Emploi</option>
              </select>
            </div>
          </div>
        </div>

        <button
          className={`button is-primary ${busy ? "is-loading" : ""}`}
          disabled={busy}
        >
          Ajouter (CREATE)
        </button>
      </form>

      <div className="box">
        <h2 className="subtitle">Liste (READ)</h2>

        {items.length === 0 ? (
          <p>Aucune transaction.</p>
        ) : (
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Type</th>
                <th>Montant</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((t) => (
                <tr key={t.id}>
                  <td>{t.label}</td>
                  <td>{t.category}</td>
                  <td>{t.type}</td>

                  <td style={{ width: 180 }}>
                    {editingId === t.id ? (
                      <input
                        className="input is-small"
                        type="number"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                    ) : (
                      `${Number(t.amount).toFixed(2)} $`
                    )}
                  </td>

                  <td className="has-text-right" style={{ width: 260 }}>
                    {editingId === t.id ? (
                      <>
                        <button
                          className="button is-success is-small mr-2"
                          onClick={() => saveEdit(t.id)}
                          type="button"
                        >
                          Sauvegarder (UPDATE)
                        </button>

                        <button
                          className="button is-light is-small mr-2"
                          onClick={cancelEdit}
                          type="button"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <button
                        className="button is-warning is-small mr-2"
                        onClick={() => startEdit(t)}
                        type="button"
                      >
                        Modifier
                      </button>
                    )}

                    <button
                      className="button is-danger is-light is-small"
                      onClick={() => onDelete(t.id)}
                      type="button"
                    >
                      Supprimer (DELETE)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}