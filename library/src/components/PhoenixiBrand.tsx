import React from 'react';
// Use the supplied IXI display face, rather than a reconstructed logo.
export function IXIMark({className=''}:{className?:string}) {
 return <span aria-hidden="true" className={`ixi-mark ${className}`}>IXI</span>;
}
