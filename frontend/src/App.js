import Login from './login.js';
import Register from './register.js';
import Menu from './menu.js';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

export function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <Menu />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


export default App;
