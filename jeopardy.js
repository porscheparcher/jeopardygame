// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://jservice.io/')}`)
                    .then(response => {
                      if (response.ok) return response.json()
                      throw new Error('Network response was not ok.')
                    })
                    .then(data => console.log(data.contents));


let catArray = [];
const NUM_CATEGORIES = 6;
const numQuestionsPerCat = 5;
const container = document.querySelector('#container')
const catDataArray = [];






/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */


async function getCategoryIds(NUM_CATEGORIES) {
    return new Promise(async (resolve, reject) => {
    try {
        const response = await axios.get(`https://jservice.io/api/categories?count=${NUM_CATEGORIES}`);
        const catId = response.data.map((category) => category.id);
        while (catArray.length < NUM_CATEGORIES) {
            const randomIds = Math.floor(Math.random() * 28163);
            if(catArray.includes(randomIds) !== true) {
                if(catArray.indexOf(randomIds) === -1)
                catArray.push(randomIds);
            }
        }
        resolve(catArray);
    }   catch (error) {
        console.error(error.message);
        reject(error);    
    };
});
};

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catArray) {
    return new Promise(async (resolve, reject) => {
    try {
        await getCategoryIds(NUM_CATEGORIES);
        for (let id of catArray) {
        const response = await axios.get(`https://jservice.io/api/category?id=${id}`);
        const categoryData = {
            title: response.data.title,
            clues: response.data.clues.map((clue) => ({
                question: clue.question,
                answer: clue.answer,
                showing: null
        }))
    };
        catDataArray.push(categoryData);
    }
    resolve(catDataArray);
} catch (error) {
    console.error(error);
    reject(error);
}})
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
        getCategoryIds(NUM_CATEGORIES);
        await getCategory(catArray);
        await fillCats(catDataArray);
        await fillCells(catDataArray);

}

async function fillCats(catDataArray) {
    for (let title of catDataArray) {
         for (let i = 0; i < NUM_CATEGORIES; i++) {
             const title = catDataArray[i].title;
             const titleCell = document.getElementById(`cat${i + 1}`);
             titleCell.textContent = title;
         }
     }

}

async function fillCells(catDataArray) {
    for (let i = 0; i < numQuestionsPerCat; i++) {
        for (let j = 0; j < NUM_CATEGORIES; j++) {
            const clues = catDataArray[j].clues;
            if (clues.length > i) {
                const clue = clues[i];
                const cluesCell = document.getElementById(`quest${i + 1}-cat${j + 1}`);

                cluesCell.addEventListener('click', function () {
                    if (cluesCell.textContent === '?') {
                      cluesCell.textContent = clue.question;
                    } else if(cluesCell.textContent = clue.question) {
                    cluesCell.textContent = clue.answer
                }
            })
            }
        }
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

//function handleClick(evt) {
//}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

async function showLoadingView() {
    document.getElementById('spinner').style.display = 'block'
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    document.getElementById('spinner').style.display = 'none'
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView();
    await getCategoryIds(NUM_CATEGORIES);
    await getCategory(catArray);
    await fillTable();
    hideLoadingView(); 
}

/** On click of start / restart button, set up game. */

const startButton = document.getElementById('btn');
startButton.addEventListener('click', function () {
        setupAndStart();
});



    const restartButton = document.getElementById('btn2')
    restartButton.addEventListener('click', function () {
    const questions = document.getElementsByClassName('question');
    const categories = document.getElementsByClassName('category');

    for (let i = 0; i < questions.length; i++) {
        questions[i].innerHTML = '';
    }
    for (let i = 0; i < categories.length; i++) {
        categories[i].innerHTML = '';
    }
    setupAndStart();
})


      

/** On page load, add event handler for clicking clues */

// TODo
