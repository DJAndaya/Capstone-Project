export const fetchUserId = () => {
    return async (dispatch) => {
      try {
        const userId = await fetch('/api/userId');
        dispatch({ type: 'USER_ID_FETCHED', payload: userId });
      } catch (error) {
        dispatch({ type: 'USER_ID_FETCH_ERROR', payload: error.message });
      }
    };
  };