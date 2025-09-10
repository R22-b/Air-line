
import React from 'react';

export const PlaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        {...props}
    >
        <path d="M22 12.23a.75.75 0 00-.356-.636l-8-4.5a.75.75 0 00-.788 0l-8 4.5A.75.75 0 004 12.23v5.445a.75.75 0 001.125.637l6.5-3.657v2.595a.75.75 0 001.5 0v-2.595l6.5 3.657A.75.75 0 0022 17.675v-5.445z" />
        <path d="M4.75 11.235l-2.5 1.406a.75.75 0 000 1.272l2.5 1.406v-4.084zM19.25 11.235v4.084l2.5-1.406a.75.75 0 000-1.272l-2.5-1.406z" />
    </svg>
);
