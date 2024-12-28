interface FiltersProps {
    search: string;
    setSearch: (value: string) => void;
    difficulty: string;
    setDifficulty: (value: string) => void;
  }
  
  const Filters: React.FC<FiltersProps> = ({ search, setSearch, difficulty, setDifficulty }) => (
    <fieldset>
      <legend>Filter Recipes</legend>
      <input
        type="text"
        placeholder="Search Recipes"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search Recipes"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        aria-label="Filter by Difficulty"
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </fieldset>
  );

  export default Filters;