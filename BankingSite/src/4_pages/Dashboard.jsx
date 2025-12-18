import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../3_context/AuthContext.jsx";
import { getTransactions } from "../6_services/transactionService.js";

export default function Dashboard() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!uid) return;
      setLoading(true);
      try {
        const data = await getTransactions(uid);
        if (mounted) setItems(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [uid]);

  const stats = useMemo(() => {
    const income = items
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const expense = items
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const balance = income - expense;

    return { income, expense, balance };
  }, [items]);

  const fmt = (n) =>
    Number(n).toLocaleString("fr-CA", { style: "currency", currency: "CAD" });

  return (
    <div className="section">
      <h1 className="title">Dashboard</h1>

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <>
          <div className="columns">
            <div className="column">
              <div className="box">
                <p className="has-text-grey">Revenus (total)</p>
                <p className="title is-4">{fmt(stats.income)}</p>
              </div>
            </div>

            <div className="column">
              <div className="box">
                <p className="has-text-grey">Dépenses (total)</p>
                <p className="title is-4">{fmt(stats.expense)}</p>
              </div>
            </div>

            <div className="column">
              <div className="box">
                <p className="has-text-grey">Solde (revenus - dépenses)</p>
                <p className="title is-4">{fmt(stats.balance)}</p>
              </div>
            </div>
          </div>

          <div className="box">
            <p className="subtitle">Dernières transactions</p>

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
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 6).map((t) => (
                    <tr key={t.id}>
                      <td>{t.label}</td>
                      <td>{t.category}</td>
                      <td>{t.type === "income" ? "Revenu" : "Dépense"}</td>
                      <td>{fmt(Number(t.amount || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
