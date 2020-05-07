import React, { useEffect, useState } from 'react';
import messages from '../../messages';

const Flash = () => {
  let [visibility, setVisibility] = useState(false);
  let [message, setMessage] = useState('');
  let [type, setType] = useState('');

  useEffect(() => {
    messages.addListener('flash', ({message, type}) => {
      setVisibility(true);
      setMessage(message);
      setType(type);

      /*
      // auto-hide
      setTimeout(() => {
        setVisibility(false);
      }, 5000);
      */
    });              
  }, []);

  useEffect(() => {
    if(document.querySelector('.close') !== null) {
      document.querySelector('.close').addEventListener('click', () => setVisibility(false));
    }
  });

  return (
    visibility && <div className={`alert alert-${type} alert-dismissible`} role="alert">
        {message}
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
  );
}

export default Flash;
