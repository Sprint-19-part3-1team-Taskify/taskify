import { useState, useEffect } from 'react';

export default function useDropdown(initValue = '') {
  const [trigger, setTrigger] = useState(initValue);
  const [toggle, setToggle] = useState(false);

  // initValue가 변경될 때 trigger 업데이트
  useEffect(() => {
    setTrigger(initValue);
  }, [initValue]);

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
