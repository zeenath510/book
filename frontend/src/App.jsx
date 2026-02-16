import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import BookDetails from "./BookDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="book/:id" element={<BookDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
