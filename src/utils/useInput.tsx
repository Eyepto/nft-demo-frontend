import { useState } from "react";

// a simple input field
const useInput = ({ type } : { type : string }) => {
  const [value, setValue] = useState("");
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} style={{width: "350px", height: "30px", marginTop: "10px"}} />;
  return [value, input];
}

export default useInput;