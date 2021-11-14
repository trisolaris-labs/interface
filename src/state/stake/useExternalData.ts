import { useEffect, useState } from 'react';
import { ExternalStakeConstant, Service } from './external-stake-constants';


export interface ExternalStakeConstants {
  results: ExternalStakeConstant[];
}

const useExternalDataService = () => {
  const [result, setResult] = useState<Service<ExternalStakeConstants[]>>({
    status: 'loading'
  });

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')
      .then(response => response.json())
      .then(response => setResult({ status: 'loaded', payload: response }))
      .catch(error => setResult({ status: 'error', error }));
  }, []);

  return [result];
};

// const useExternalDataService = ExternalStakeConstants {
//     useEffect(() => {
//     fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')
//       .then(results => results.json())
//       .then(data => {
//         setStakingInfoData(data)
//       })
//   }, [])

// }

// const useExternalDataService = () => {
//   const [result, setResult] = useState<Service<ExternalStakeConstants[]>>({
//     status: 'loading'
//   });

//   useEffect(() => {
//     fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')
//       .then(response => response.json())
//       .then(response => setResult({ status: 'loaded', payload: response }))
//       .catch(error => setResult({ status: 'error', error }));
//   }, []);

//   return result;
// };


//   useEffect(() => {
//     fetch('https://raw.githubusercontent.com/trisolaris-labs/apr/master/data.json')
//       .then(results => results.json())
//       .then(data => {
//         setStakingInfoData(data)
//       })
//   }, [])



export default useExternalDataService;