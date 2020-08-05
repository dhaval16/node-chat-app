const users = [];

const adduser = ({id,username,room}) =>{
    
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }

    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username;
    })

    if(existingUser){
        return{
            eroor:'Username is in use'
        }
    }

    const user = {id,username,room};
    users.push(user);
    return {user};
}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>{
        return user.id === id
    });

    if(index !== -1)
    {
        return users.splice(index,1);
    }
}

const getUser = (id) =>{
    const user = users.find((u)=>{
        return u.id === id;
    })
    if(user !== -1)
    {
        return user;
    }
}

const getUserInRoom = (room) =>{
    //room = room.trim().toLowerCase()
    return users.filter((u)=>{
        return u.room === room
    })       
}

// adduser({
//     id:16,
//     username:'dhaval',
//     room:'surat'
// })
// adduser({
//     id:24,
//     username:'parmar',
//     room:'surat'
// })
// adduser({
//     id:4,
//     username:'pc',
//     room:'vru'
// })

// console.log(users);
// console.log("Find User");
// console.log(getUser(24));
// console.log("Room Member");
// console.log(getUserInRoom('vru'));


module.exports = {
    adduser,
    removeUser,
    getUser,
    getUserInRoom 
}
// const res= adduser({
//     id:24,
//     username:'dhaval',
//     room:'india'
// })
//console.log(users);
//const removeUsers = removeUser(16);
//console.log(users);
