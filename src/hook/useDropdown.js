import { useState } from 'react';

export default function useDropdown(initValue = '') {
  const [trigger, setTrigger] = useState(initValue);
  const [toggle, setToggle] = useState(false);

  const onTrigger = (e) => {
    setToggle((prev) => !prev);
  };
  const onSelect = (e) => {
    const txt = e.currentTarget.dataset.target;
    setToggle(false);
    setTrigger(txt);
  };

  return { trigger, toggle, onTrigger, onSelect };
}
