import React, {useState, useEffect} from 'react';
import Api from '../Api';

export default function Kittens() {
  const [kittens, setKittens] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await Api.call('/kittens');
      if (res) setKittens(res.data);  
    })();
  });

  return(
    <div>
      <h1>Kittens</h1>

      {kittens.map(kitten => <h3 key={kitten.id}>{kitten.name}</h3>)}
    </div>
  );
}
