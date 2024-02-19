import { h, Fragment } from 'preact';
import CountySearch from './CountySearch';
import { useEffect, useState } from 'preact/hooks';
import DataCard from './DataCard';
import { Loader2 } from 'lucide-preact';

export default function Block() {
  const [openCounty, setOpenCounty] = useState(null);
  const [data, setData] = useState(null);
  const county = data && openCounty ? data.records.filter(record => record.fields[data.settings.searchField] === openCounty)[0] : null;
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetch('/wp-json/lookup/v1/data').then(res => res.json());
      setData(fetchedData);
    }
    fetchData();
  }, []);
  return (
    <div class="border-2  rounded-xl border-black aspect-[3/2] flex flex-col overflow-hidden relative">
      {data ? (
        <>
          <div class="p-4">
            <h2 class="font-bold text-2xl text-center text-white">
              Look up how your local economy can see a boost by closing the health insurance coverage gap.
            </h2>
          </div>
          {county ? (
            <DataCard {...county} {...data.settings} setOpenCounty={setOpenCounty} />
          ) : (
            <div class="p-4 flex-1">
              <CountySearch setOpenCounty={setOpenCounty} />
            </div>
          )}
        </>
      ) : (
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 class="animate-spin w-12 h-12" color="white" />
        </div>
      )}
    </div>
  );
}