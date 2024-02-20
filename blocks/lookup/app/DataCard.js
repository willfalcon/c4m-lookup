import { h } from 'preact';
import Data from './Data';
import { X } from 'lucide-preact';
import { useEffect, useState } from 'preact/hooks';
import classNames from 'classnames';

export default function DataCard(props) {
  const { searchField, fields, careReduction, jobs, taxRevenue, setOpenCounty } = props;

  const county = fields[searchField];
  const careReductionArr = fields[careReduction.airtable_column].split('.');
  if (careReductionArr > 1) {
    careReductionArr.pop();
  }
  careReductionArr.pop();
  const careReductionValue = careReductionArr.join('');
  const jobsValue = fields[jobs.airtable_column];
  const taxRevenueArr = fields[taxRevenue.airtable_column].split('.');
  if (taxRevenueArr.length > 1) {
    taxRevenueArr.pop();
  }
  const taxRevenueValue = taxRevenueArr.join('');

  const careReductionIcon = careReduction.icon_select;
  const jobsIcon = jobs.icon_select;
  const taxRevenueIcon = taxRevenue.icon_select;

  const [entered, enter] = useState(false);
  useEffect(() => {
    enter(true);
  }, []);

  return (
    // <div class="absolute w-full h-full z-10 top-0 left-0 bg-gradient-to-tr from-c4m-yellow-300 to-c4m-blue-400 to-60%">
    <div class="absolute w-full h-full z-10 top-0 left-0 card-gradient flex flex-col justify-evenly">
      <button
        class="close-button absolute top-2 right-2 z-10"
        onClick={() => {
          setOpenCounty(null);
        }}
      >
        <X />
      </button>
      <img
        class={classNames('county-bg absolute w-full h-full object-contain transition duration-300', {
          'scale-50': !entered,
          'opacity-0': !entered,
        })}
        src={`../wp-content/plugins/c4m-lookup/blocks/lookup/counties/${county.toLowerCase()}.svg`}
        alt={`${county} outline`}
      />
      <h3 class="text-center uppercase text-white">
        <span class="block font-extrabold text-7xl">{county}</span> <span class="block font-bold text-4xl">County</span>
      </h3>
      <div class="grid grid-cols-3 gap-6 px-4 mt-9">
        <Data
          icon={careReductionIcon}
          value={careReductionValue}
          label="Reduction in Uncompensated Care"
          bgColor="bg-c4m-blue-700"
          valueColor="text-c4m-yellow-200"
          labelColor="text-c4m-blue-100"
          delay={0}
        />
        <Data
          icon={jobsIcon}
          value={jobsValue}
          label="Jobs"
          bgColor="bg-c4m-yellow-400"
          valueColor="text-white"
          labelColor="text-white"
          delay={100}
        />
        <Data
          icon={taxRevenueIcon}
          value={taxRevenueValue}
          label="Local Tax Revenue"
          bgColor="bg-c4m-blue-100"
          valueColor="text-c4m-blue-700"
          labelColor="text-c4m-blue-700"
          delay={200}
        />
      </div>
    </div>
  );
}
