import "./App.css";
import PdfGenerator from "./PdfGenrator";

function App() {
  const tableData = {
    headers: ['Name', 'Age', 'Country'],
    rows: [
      ['John Doe', '30', 'USA'],
      ['Jane Smith', '25', 'Canada'],
      ['Bob Johnson', '40', 'UK']
    ]
  };
  return (
    <div className="App">
      <PdfGenerator tableData={tableData} />
    </div>
  );
}

export default App;
