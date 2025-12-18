import { useState, useEffect } from "react";
import { useAuth } from "../3_context/AuthContext.jsx";
import { getTransactions } from "../6_services/transactionService.js";
import { askChatbot } from "../6_services/aiService.js";

/*
  Composant Chatbot
  - Fournit un assistant IA intégré à l'application
  - Permet de poser des questions liées aux finances
*/
export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Bonjour ! Comment puis-je vous aider avec vos finances aujourd'hui ?"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  /* ---------------------------------------------------
     Chargement des transactions utilisateur
     - Appelé une seule fois après la connexion
     - Les données servent de contexte à l'IA
  --------------------------------------------------- */
  useEffect(() => {
    if (user?.uid) {
      getTransactions(user.uid).then(setTransactions);
    }
  }, [user]);

  /* ---------------------------------------------------
     Envoi d'un message à l'IA
     - Ajoute le message utilisateur à l'interface
     - Envoie la question + transactions à l'IA
     - Ajoute la réponse de l'IA dans la conversation
  --------------------------------------------------- */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");

    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    // Appel au service IA avec le contexte financier
    const botResponse = await askChatbot(
      userMsg,
      transactions,
      user.uid
    );

    // Ajout de la réponse de l'IA
    setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    setLoading(false);
  };

  // Le chatbot n'est visible que si l'utilisateur est connecté
  if (!user) return null;

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      
      {/* Bouton flottant pour ouvrir le chatbot */}
      <button 
        className="button is-primary is-rounded is-large" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
      >
        {isOpen ? "✕" : "💬 AI"}
      </button>

      {isOpen && (
        <div
          className="box"
          style={{
            position: "absolute",
            bottom: "70px",
            right: "0",
            width: "350px",
            height: "450px",
            display: "flex",
            flexDirection: "column",
            padding: "15px"
          }}
        >
          <h3 className="subtitle is-6 mb-3">Assistant NovaBank</h3>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-2 ${m.role === "user" ? "has-text-right" : ""}`}
              >
                <span
                  className={`tag ${m.role === "user" ? "is-info" : "is-light"}`}
                  style={{
                    whiteSpace: "pre-wrap",
                    height: "auto",
                    padding: "8px",
                    color: m.role === "bot" ? "#000000" : "white",
                    fontWeight: m.role === "bot" ? "600" : "normal"
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}

            {loading && (
              <p className="is-size-7 has-text-grey">
                L'IA réfléchit...
              </p>
            )}
          </div>

          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input is-small"
                type="text"
                placeholder="Posez une question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
            </div>
            <div className="control">
              <button
                className="button is-primary is-small"
                onClick={handleSend}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}