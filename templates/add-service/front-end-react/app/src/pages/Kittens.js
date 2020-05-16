import React, { useState, useEffect } from 'react';
import Api from '../Api';

const Kittens = () => {
  const [kittens, setKittens] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await Api.call('/kittens');
      if (res) setKittens(res.data);  
    }
    fetchData();
  }, []);

  return(
    <div>
      <h1>Kittens</h1>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          {kittens.map(kitten => {
            return (
              <tr key={kitten.id}>
                <th scope="row">{kitten.id}</th>
                <td>{kitten.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}

export default Kittens;