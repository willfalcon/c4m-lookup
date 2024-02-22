import { h } from 'preact';
import { useState } from 'preact/hooks';
import { debounce } from './utils';

import counties from './counties';
import { ArrowRight } from 'lucide-preact';

export default function CountySearch({ setOpenCounty }) {
  const [query, setQuery] = useState('');
  const [countyResults, setCounties] = useState([]);

  function searchCounties(e) {
    const query = e.target.value;
    setQuery(query);
    if (query) {
      const matchedCounties = counties.filter(county => county.toLowerCase().includes(query.toLowerCase()));

      if (matchedCounties.length < 6) {
        setCounties(matchedCounties);
      }
    } else {
      setCounties([]);
    }
  }

  return (
    <div class="p-4 pt-0 md:pt-12 md:px-8 z-0">
      <label htmlFor="location-search" class="text-center">
        Start typing your county name:
      </label>
      <div>
        <input
          name="location-search"
          id="location-search"
          class="border-black rounded px-4 py-2"
          onInput={debounce(searchCounties, 200)}
          value={query}
        />
      </div>
      {!!countyResults.length && (
        <ul class="bg-tan py-2 px-1">
          {countyResults.map(county => {
            return (
              <li key={county} className="list-none">
                <button
                  class="select:bg-tan hover:bg-tan focus:bg-tan group p-1 pr-2"
                  onClick={() => {
                    setOpenCounty(county);
                  }}
                >
                  {county} <ArrowRight class="inline group-hover:translate-x-1 group-focus:translate-x-1" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
