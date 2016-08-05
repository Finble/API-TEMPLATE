// updating object property

var person = {
    name: 'Andrew',
    age: 21
};


function updatePerson (obj) {
//    obj = {
//        name: 'Andrew', 
//        age: 24
//    };
    
    obj.age = 24;  // overrides original object property
}

updatePerson(person);
console.log(person);

// updating array property

var grades = [15, 88];

function addGrades (grades) {
    grades.push(55); // adds grade to array  
    debugger;
}

addGrades(grades);
console.log(grades);
