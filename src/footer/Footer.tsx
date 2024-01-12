import React from "react";
import "./Footer.css";

const Footer: React.FC<{}> = () => {
  return (
    <footer className="p-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024 Lachlan Gibson
        </span>
        <div className="flex mt-2 sm:justify-center sm:mt-0">
          <a
            href="https://www.linkedin.com/in/lachlan-james-gibson/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Lachlan's LinkedIn profile"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
            </svg>
            <span className="sr-only">LinkedIn account</span>
          </a>

          <a
            href="https://github.com/LachlanGibson"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Lachlan's GitHub profile"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">GitHub account</span>
          </a>
          <a
            href="https://scholar.google.com/citations?user=NeEMSU0AAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Lachlan's Google Scholar profile"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 256 256"
              width="50px"
              height="50px"
              fill="currentColor"
            >
              <g transform="scale(5.12,5.12)">
                <path d="M25,2c-12.69047,0 -23,10.30953 -23,23c0,12.69047 10.30953,23 23,23c12.69047,0 23,-10.30953 23,-23c0,-12.69047 -10.30953,-23 -23,-23zM25,4c11.60953,0 21,9.39047 21,21c0,11.60953 -9.39047,21 -21,21c-11.60953,0 -21,-9.39047 -21,-21c0,-11.60953 9.39047,-21 21,-21zM21,11l-10,9h6.78125c0.02,2.847 2.18628,5.73047 5.98828,5.73047c0.36,0 0.76016,-0.04008 1.16016,-0.08008c-0.18,0.45 -0.36914,0.81969 -0.36914,1.42969c0,1.15 0.57984,1.84 1.08984,2.5c-1.63,0.11 -4.66062,0.29945 -6.89062,1.68945c-2.13,1.29 -2.7793,3.16047 -2.7793,4.48047c0,2.72 2.52,5.25 7.75,5.25c6.2,0 9.49023,-3.48945 9.49023,-6.93945c0,-2.53 -1.44125,-3.78063 -3.03125,-5.14062l-1.28906,-1.0293c-0.4,-0.32 -0.95117,-0.77031 -0.95117,-1.57031c0,-0.81 0.55148,-1.33055 1.02148,-1.81055c1.51,-1.2 3.0293,-2.54953 3.0293,-5.26953c0,-1.043 -0.2438,-1.89184 -0.5918,-2.58984l3.5918,-3.08008v3.70703c-0.595,0.346 -1,0.98366 -1,1.72266v6c0,1.104 0.896,2 2,2c1.104,0 2,-0.896 2,-2v-6c0,-0.738 -0.405,-1.37566 -1,-1.72266v-5.27734c0,-0.043 -0.01939,-0.07909 -0.02539,-0.12109l1.02539,-0.87891zM24.26953,14.24023c3,0 4.55078,4.10977 4.55078,6.75977c0,0.65 -0.08039,1.81992 -0.90039,2.66992c-0.58,0.59 -1.54898,1.0293 -2.45898,1.0293c-3.09,0 -4.51172,-4.07906 -4.51172,-6.53906c0,-0.95 0.19078,-1.93922 0.80078,-2.69922c0.58,-0.75 1.58953,-1.2207 2.51953,-1.2207zM26.03906,30.60938c0.37,0 0.5518,0.00102 0.8418,0.04102c2.74,1.98 3.91992,2.96984 3.91992,4.83984c0,2.27 -1.83078,3.9707 -5.30078,3.9707c-3.86,0 -6.33984,-1.87047 -6.33984,-4.48047c0,-2.61 2.29961,-3.48125 3.09961,-3.78125c1.51,-0.52 3.4593,-0.58984 3.7793,-0.58984z"></path>
              </g>
            </svg>
            <span className="sr-only">Google Scholar account</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
