const SearchBar = () => {
  return (
    <div className="w-full bg-white shadow-md px-4 py-3 z-[1000]">
      <div className="mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for buildings, rooms, or locations..."
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-orange-500 transition-colors"
            aria-label="Search"
          ></button>{" "}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
