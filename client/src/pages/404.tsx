import "../App.css";
import { Link } from "react-router-dom";
const _404:React.FC<{}> = () =>{

  return (
    <div className="App">
      <h1 data-testid>404 - Not Found</h1>
      <Link to="/">Home page</Link>
    </div>
  );
}

export default _404;
