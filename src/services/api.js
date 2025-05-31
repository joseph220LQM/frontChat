export async function sendMessage({ name, studentId, email, message }) {
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, studentId, email, message }),
  });

  if (!res.ok) {
    throw new Error("Error al comunicarse con el agente.");
  }

  const data = await res.json();
  return data.reply;
}
export async function getChatHistory(email) {
  const res = await fetch(`http://localhost:5000/api/chat/history?email=${email}`);

  if (!res.ok) {
    throw new Error("Error al obtener historial del chat.");
  }

  const data = await res.json();
  return data.history;
}

