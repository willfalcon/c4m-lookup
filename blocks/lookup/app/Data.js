import classNames from 'classnames';
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import textFit from 'textfit';

export default function Data({ icon, value, label, bgColor, valueColor, labelColor, delay }) {
  const ref = useRef(null);
  const [spanFlex, setSpanFlex] = useState(true);
  const [spanHeight, setSpanHeight] = useState('auto');
  const [entered, enter] = useState(false);
  useEffect(() => {
    if (ref.current) {
      const size = ref.current.getBoundingClientRect();
      ref.current.style.width = `${size.width}px`;
      eight = `${size.height}px`;
      setSpanHeight(`${size.height}px`);
      textFit(ref.current, {
        maxFontSize: 100,
      });
      setSpanHeight('auto');
      setSpanFlex(false);
      setTimeout(() => {
        enter(true);
      }, delay);
    }
  }, [ref.current]);

  return (
    <div
      class={classNames(
        'rounded-full aspect-square text-center flex flex-col items-center content-center pb-6 transition duration-200',
        bgColor,
        {
          '-translate-y-2': entered,
          'opacity-0': !entered,
        }
      )}
    >
      <img src={`../wp-content/plugins/c4m-lookup/dist/${icon}.png`} class="w-20 h-20 inline-block -mt-9 mx-auto" />
      <div class="row-span-2 w-full flex-1 flex flex-col">
        <span
          class={classNames('font-bold w-[80%] mx-auto *:leading-none', valueColor, { 'flex-1': spanFlex, height: spanHeight })}
          ref={ref}
        >
          {value}
        </span>
        <span class={classNames('block font-semibold w-[80%] mx-auto text-base', labelColor)}>{label}</span>
      </div>
    </div>
  );
}
