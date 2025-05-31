import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const [user, setUser] = useState(null);

  return user ? (
    <ChatPage user={user} />
  ) : (
    <LoginPage onLogin={setUser} />
  );
}

export default App;


