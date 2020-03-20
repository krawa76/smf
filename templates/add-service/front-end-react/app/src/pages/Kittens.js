import React from 'react';
import Api from '../Api';

export default class Kittens extends React.Component {
  constructor() {
    super();
    this.state = {kittens: []}
  }

  async componentDidMount() {
    const res = await Api.call('/kittens');
    this.setState({kittens: res.data});
  }  

  render() {
    return(
      <div>
        <h1>URL = {process.env.REACT_APP_API_URL}</h1>
        <h1>Kittens</h1>

        {this.state.kittens.map(kitten => <h3 key={kitten.id}>{kitten.name}</h3>)}
      </div>
    );
  }
}
