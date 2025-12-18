const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const OpenAI = require("openai");

const openAiKey = defineSecret("OPENAI_API_KEY");

exports.askChatbotSecure = onCall({ secrets: [openAiKey] }, async (request) => {
  // l'utilisateur doit être connecté
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Identification requise.");
  }

  const { question, transactions } = request.data;
  const openai = new OpenAI({ apiKey: openAiKey.value() });

  const tools = [{
    type: "function",
    function: {
      name: "createTransaction",
      description: "Ajoute une dépense ou un revenu.",
      parameters: {
        type: "object",
        properties: {
          label: { type: "string" },
          amount: { type: "number" },
          type: { type: "string", enum: ["income", "expense"] },
          category: { type: "string" }
        },
        required: ["label", "amount", "type", "category"]
      }
    }
  }];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Tu es l'assistant de NovaBank. Voici les transactions : ${JSON.stringify(transactions)}` },
        { role: "user", content: question }
      ],
      tools: tools
    });

    const message = response.choices[0].message;

    // On renvoie soit le texte, soit l'ordre de créer une transaction
    return {
      text: message.content,
      toolCall: message.tool_calls ? {
        name: message.tool_calls[0].function.name,
        args: JSON.parse(message.tool_calls[0].function.arguments)
      } : null
    };
  } catch (error) {
    throw new HttpsError("internal", error.message);
  }
});