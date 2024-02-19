import classNames from 'classnames';
import { h } from 'preact';

export default function Data({ icon, value, label, bgColor, valueColor, labelColor }) {
  return (
    <div class={classNames('rounded-full aspect-square text-center grid-rows-3 justify-items-center', bgColor)}>
      <img src={`../wp-content/plugins/c4m-lookup/dist/${icon}.png`} class="w-20 h-20 inline-block -mt-9 mx-auto" />
      <div class="row-span-2 w-full">
        <span class={classNames('block text-2xl font-bold w-[80%] mx-auto', valueColor)}>{value}</span>
        <span class={classNames('block font-semibold w-[80%] mx-auto text-base', labelColor)}>{label}</span>
      </div>
    </div>
  );
}
