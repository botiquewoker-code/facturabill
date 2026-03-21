import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <h1>Hola {user.username}</h1>
          <button onClick={signOut}>Salir</button>
        </div>
      )}
    </Authenticator>
  );
}
