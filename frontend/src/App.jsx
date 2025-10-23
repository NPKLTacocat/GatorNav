import Map from "./components/Map";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <SearchBar />
      <div className="flex-1">
        <Map />
      </div>
    </div>
  );
}

export default App;
