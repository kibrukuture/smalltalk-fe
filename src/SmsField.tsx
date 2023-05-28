import './styles.css';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

export default function SmsField() {
  //
  const [one, setOne] = useState();
  const [two, setTwo] = useState();
  const [three, setThree] = useState();
  const [four, setFour] = useState();
  const [focus, setFocus] = useState('one');
  //
  //refs
  const refOne = useRef<HTMLInputElement>(null),
    refTwo = useRef<HTMLInputElement>(null),
    refThree = useRef<HTMLInputElement>(null),
    refFour = useRef<HTMLInputElement>(null);

  //focus input
  useEffect(() => {
    if (refOne.current) {
      // refOne.current.focus();
    }
  }, []);

  const handleCode = (e: KeyboardEvent<HTMLInputElement>, flag: string) => {
    //cons
    let val = e.target.value!.trim()!;
    let key = e.keyCode;
    //one

    if (refOne.current && refTwo.current && refThree.current && refFour.current) {
      if (flag === 'one' && val) {
        //
        setOne(val);
        refTwo.current.focus();
        setFocus('two');
        if (key === 39) {
          refTwo.current.focus();
        }
      } else if (flag === 'two') {
        //
        setTwo(val);
        refThree.current.focus();
        setFocus('three');
        if (key === 8 || key === 37) {
          refOne.current.focus();
          setFocus('one');
        } else if (key === 39) {
          refThree.current.focus();
        }
      } else if (flag === 'three') {
        //
        setThree(val);
        refFour.current.focus();
        setFocus('four');
        if (key === 8 || key === 37) {
          refTwo.current.focus();
          setFocus('two');
        } else if (key === 39) {
          refFour.current.focus();
        }
      } else if (flag === 'four') {
        //
        setFour(val);
        if (key === 8 || key === 37) {
          refThree.current.focus();
          setFocus('three');
        }
      }
    }
  };

  const focusStyle = 'outline outline-2 outline-gray-400';
  return (
    <div className='App'>
      <input maxLength={1} type='text' onKeyUp={(e) => handleCode(e, 'one')} ref={refOne} className={`${focus === 'one' && focusStyle}`} />
      <input maxLength={1} type='text' onKeyUp={(e) => handleCode(e, 'two')} ref={refTwo} className={`${focus === 'two' && focusStyle}`} />
      <input maxLength={1} type='text' onKeyUp={(e) => handleCode(e, 'three')} ref={refThree} className={`${focus === 'three' && focusStyle}`} />
      <input maxLength={1} type='text' onKeyUp={(e) => handleCode(e, 'four')} ref={refFour} className={`${focus === 'four' && focusStyle}`} />
    </div>
  );
}
