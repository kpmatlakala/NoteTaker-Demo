import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('todos')) || [];
const todoSlice = createSlice({
    name: "todoList",
    initialState,
    reducers: {
        addTodoItem: (state, action) => 
            {
                state.push(action.payload);
                localStorage.setItem('todos', JSON.stringify(state));
            },

        deleteTodoItem : (state, action) =>
            {
                const newState = state.filter(list=> list.id !==action.payload)
                localStorage.setItem('todos', JSON.stringify(newState));
                return newState;
            },

        editTodoItem: (state, action) => 
            {
                const { id, todoItem } = action.payload;
                const todoIndex = state.findIndex((todo) => todo.id === id);
                if (todoIndex !== -1)
                {
                    state[todoIndex].todoItem = todoItem;
                    localStorage.setItem('todos', JSON.stringify(state));
                }
                return state;
            }

    }
});

export const { addTodoItem , deleteTodoItem, editTodoItem } = todoSlice.actions;
export default todoSlice.reducer;
