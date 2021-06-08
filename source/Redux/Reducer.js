const initialState = {
  update: false,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE':
      return {
        ...state,
        update: !state.update,
      };
    default:
      return state;
  }
};
