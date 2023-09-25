import { create } from "zustand";
import { produce } from "immer";
import { toast } from "react-toastify";
import { createRef } from "react";


// export const useAppStore = create((set) => {
//     return{
//         count: 0,
//         username:"John",
//         show: true,
//         students: ["John", "Rahul", "Mathew"],
//         actors: [
//             {id:"001", name: "Brad Pitt", votes:24},
//             {id:"002", name: "Tom Cruise", votes:32},
//             {id:"003", name: "Keanu Reeves", votes:96},
//             {id:"004", name: "Chris Pratt", votes:16},
//         ],
//         users: [],
//         loading: false,
//         error: null,

//         increaseCount:() => {
//             set((state) => ({count:state.count+1}))
//         },
//         increaseCountByValue: (val) =>{
//             set((state) => ({count: state.count+val}))
//         },
//         addStudent:(student)=>{
//             // set((state) => ({students: [...state.students, student]}))
//             set(produce(() => {state.students.push(student)}))
//         },
//         increaseVoteCount:(id)=>{
//             // set((state) => ({actors: state.actors.map(actor => {
//             //     return id === actor.id ? {...actor, votes:actor.votes+1} : actor
//             // })}))

//             set(produce((state) => { 
//                 let clickedActor = state.actors.find((actor) => actor.id===id);
//                 clickedActor.votes += 1;                
//             }))
//         },
//         fetchUsers: async() => {
//             set(() => ({loading: true}))
//             try{
//                 let res = await fetch("https://reqres.in/api/users?");
//                 let data = await res.json();
//                 set(() => ({users:data, loading:false}));
//             }
//             catch(error)
//             {
//                 set(() => ({error: error.message, loading:false}));                
//             }
//         }
//     }
// })

export const useAppStore = create((set) => ({
  search: "",
      
  changeTheValueOfSearch: (value) => {
    set(produce((state) => {
      state.search = value;
      console.log(state.search);
    }));
  }
}));

  