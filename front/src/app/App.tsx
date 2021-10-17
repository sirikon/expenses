import React, { useState } from "react";

export default () => {
  const [text, setText] = useState(EXPENSES_BASE_URL);

  return <>
    <h1>{text}</h1>
    <TextInput text={text} onText={setText}></TextInput>
  </>;
};

type TextInputParams = {
  text: string,
  onText: (text: string) => void
}

const TextInput = (params: TextInputParams) => 
  <input
    type="text"
    value={params.text}
    onChange={(e) => params.onText(e.target.value)} />
