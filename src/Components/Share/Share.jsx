import React from 'react';
import { ShareSocial } from 'react-share-social';

const style = {
  root: {
    background: '#1e293b',
    color: 'white',
    borderRadius:'10px',
    padding:'0px',
    margin:'0px',
  },
  copyContainer: {
    background: '#475569',
    border: 'none',
    color:'',
  },
  title: {
    color: 'white',
    fontFamily: 'Segoe UI Symbol',
  },
};

export default function Share({ url,title }) {
  return (
    <ShareSocial
      url={url}
      socialTypes={['email','facebook','whatsapp', 'twitter','linkedin','telegram','reddit']}
      style={style}
      title={title}
    />
  );
}

