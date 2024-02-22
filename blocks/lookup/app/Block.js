import { h, Fragment } from 'preact';
import CountySearch from './CountySearch';
import { useEffect, useState } from 'preact/hooks';
import DataCard from './DataCard';
import { Loader2 } from 'lucide-preact';
import Error from './Error';

export default function Block({ admin }) {
  const [openCounty, setOpenCounty] = useState(null);
  const [data, setData] = useState(null);
  console.log(data);
  const [error, setError] = useState(null);
  const county = data && openCounty ? data.records.filter(record => record.fields[data.settings.searchField] === openCounty)[0] : null;
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await fetch('/wp-json/lookup/v1/data').then(res => res.json());
        if (fetchedData.code) {
          setError(fetchedData);
        } else {
          setData(fetchedData);
        }
      } catch (e) {
        console.error(e);
        setError(e);
      }
    }
    fetchData();
  }, []);

  return (
    <div class="border-2  rounded-xl border-black aspect-square md:aspect-[3/2] flex flex-col overflow-hidden relative">
      {data ? (
        <>
          <div class="p-3">
            <h2 class="font-bold md:text-2xl text-center text-white">
              Look up how your local economy can see a boost by closing the health insurance coverage gap.
            </h2>
          </div>
          {county ? (
            <DataCard {...county} {...data.settings} setOpenCounty={setOpenCounty} />
          ) : (
            <div class="p-3 pt-0 md:pt-3 flex-1">
              <CountySearch setOpenCounty={setOpenCounty} />
            </div>
          )}
        </>
      ) : error ? (
        <Error {...error} admin={admin} />
      ) : (
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 class="animate-spin w-12 h-12" color="white" />
        </div>
      )}
    </div>
  );
}
