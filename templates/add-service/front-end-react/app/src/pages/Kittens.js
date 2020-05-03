import React from 'react';
import Api from '../Api';

export default class Kittens extends React.Component {
  constructor() {
    super();
    this.state = {kittens: []}
  }

  async componentDidMount() {
    const res = await Api.call('/kittens');
    if (res) this.setState({kittens: res.data});
  }  

  render() {
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
            {this.state.kittens.map(kitten => {
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
}
