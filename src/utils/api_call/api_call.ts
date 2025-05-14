
const LOCAL = "http://localhost:3000/process/";
const SERVER = "https://scheduler-docker-server.onrender.com/process/";
// input: api_endpoint, current state
// output: data responding to 'endpoint'
export async function getApiData(copy_state: any, api_endpoint:string, graduationDate?: string) {

    const combineStateToJSON = (graduationDate?: string): object => {
        return {
            taken: Array.from(copy_state.taken),
            need_complete: Array.from(copy_state.need_complete),
            need_specilazation: Array.from(copy_state.need_specilazation),
            need_specilazation_elective: Array.from(copy_state.need_specilazation_elective),
            need_project: Array.from(copy_state.need_project),
            need_others: Array.from(copy_state.need_others),
            major: copy_state.major,
            prefer: Array.from(copy_state.prefer),
            num_total: copy_state.num_total,
            num_project: copy_state.num_project,
            graduation_date: graduationDate,
        };
    };
    
    return await apiCall(combineStateToJSON(), api_endpoint); // Call function and pass data
  }

const apiCall = async (wholeList: object, api_endpoint:string) => {
    try {
      const response = await fetch(`${SERVER}${api_endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(wholeList), // Only stringify here
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('RESULET::::::::::', result)
      return result;
    }
    catch(error) {
      console.error(`Error fetching from Server for ${api_endpoint}`, error);
      throw error;
    }
  }