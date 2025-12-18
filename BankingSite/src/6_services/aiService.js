import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../2_config/firebase";
import { createTransaction } from "./transactionService";

const functions = getFunctions(app);

export async function askChatbot(question, transactions, userId) {
  const askChatbotFn = httpsCallable(functions, "askChatbotSecure");
  
  try {
    const result = await askChatbotFn({ 
      question, 
      transactions: transactions.map(t => ({
        type: t.type,
        label: t.label,
        amount: t.amount,
        category: t.category
      }))
    });

    const { text, toolCall } = result.data;

    if (toolCall && toolCall.name === "createTransaction") {
      const { label, amount, type, category } = toolCall.args;
      
      await createTransaction(userId, {
        label,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date().toISOString()
      });

      return `D'accord ! J'ai ajouté la transaction : ${label} (${amount} CAD) dans la catégorie ${category}.`;
    }

    return text;
  } catch (error) {
    console.error("Erreur IA:", error);
    return "Désolé, je ne peux pas traiter votre demande via le serveur sécurisé.";
  }
}