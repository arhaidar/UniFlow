
//input: dispatch & data
//output: void
//function: compare with taken list and update with new list in each NEED_LIST
export function progress_upadate(dispatch: React.Dispatch<any>, state: React.SetStateAction<any>):void {
    if (state.update_flag === 0) {
      console.log("UPDATE NO NEED")
      return;
    }
    else if(state.update_flag !== 1) {
      return;
    }
    dispatch({ type: "BATCH_UPDATE_NEEDS", payload: state.taken });
  }
