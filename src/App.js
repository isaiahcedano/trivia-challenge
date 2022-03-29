import Screen from './components/Screen/Screen';
import routes from './routes';
import {useState, useEffect} from 'react';
import he from 'he';

const App = () => {
  /* We'll be using a more simple way of routing as the project isn't very large,
   and plus we'll have the added benefit of default 'authenticated'
   routing, meaning our visitors won't be able to cheat by skipping questions
   through changing the url paths. */
  const {INITIAL, QUESTION, FINISHED} = routes;

  const [route, setRoute] = useState(INITIAL);
  const [questions, setQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [incorrectAnsweredQuestions, setIncorrectAnsweredQuestions] = useState([]);
  const [correctAnsweredQuestions, setCorrectAnsweredQuestions] = useState([]);

  const screenTextCss = "screen-text";
  const screenTextTitleCss = `${screenTextCss} screen-title`;
  const screenButtonCss = `ttu ${screenTextTitleCss} screen-btn`;

  const validAnswer = (answer, correctAnswer) => {
    return answer === correctAnswer;
  }

  useEffect(() => {
    const renewAppQuestions = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean");
        const {results} = await response.json();
        setQuestions(results.reduce((current, {category, correct_answer, question}) => {
          return [
            ...current,
            {
              correct_answer,
              category: he.decode(category),
              question: he.decode(question),
            }
          ]
        }, []));
        setTotalQuestions(results.length);
      } catch(err) {};
    }
    if (route === INITIAL) {
      renewAppQuestions();
    }
  }, [route, INITIAL]);

  const getQuestion = (questions, answeredQuestions, index, info="category") => {
    return questions.reduce((curr, {category, question, correct_answer}) => {
      switch(info) {
        case "category":
          return [
            ...curr,
            [category],
          ];
        case "question":
          return [
            ...curr,
            [question],
          ];
        case "answer":
          return [
            ...curr,
            [correct_answer],
          ];
        default:
          return curr;
      }
    }, [])[index]
  }

  const handleAnswerButton = (answer) => {
    const question = questions[answeredQuestions.length];
    const answerIsValid = validAnswer(answer, getQuestion(questions,
      answeredQuestions,
      answeredQuestions.length,
      "answer")[0]);
    if (question === questions[questions.length-1]) {
      setRoute(FINISHED);
    } else {
      setAnsweredQuestions([
        ...answeredQuestions,
        question,
      ]);
    }

    if (answerIsValid) {
      setCorrectAnsweredQuestions([
        ...correctAnsweredQuestions,
        question
      ]);
    } else {
      setIncorrectAnsweredQuestions([
        ...incorrectAnsweredQuestions,
        question
      ])
    }
  }

  const reset = () => {
    setRoute(INITIAL);
    setAnsweredQuestions([]);
    setCorrectAnsweredQuestions([]);
    setIncorrectAnsweredQuestions([]);
  }

  return (
    <>
      {
        {
          [INITIAL]: <Screen items={[
              {
                type: "text",
                text: "Welcome to the Trivia Challenge!",
                cssClass: `b ${screenTextTitleCss}`,
              },
              {
                type: "text",
                text: "You will be presented with 10 True or False questions.",
                cssClass: screenTextCss,
              },
              {
                type: "text",
                text: "Can you score 100%?",
                cssClass: screenTextCss,
              },
              {
                type: "button",
                text: "Begin",
                cssClass: screenButtonCss,
                callBack: () => {
                  setRoute(QUESTION);
                }
              }
            ]}/>,
          [QUESTION]: <Screen items={[
            {
              type: "text",
              text: getQuestion(questions,
                answeredQuestions,
                answeredQuestions.length),
              cssClass: `b ${screenTextTitleCss}`,
            },
            {
              type: "question",
              text: getQuestion(questions,
                answeredQuestions,
                answeredQuestions.length,
                "question"),
              questionProgress: {
                total: totalQuestions,
                current: answeredQuestions.length+1
              },
              cssClass: screenTextCss,
            },
            {
              type: "answer",
              text: [["True", ()=>{
                handleAnswerButton("True");
              }], ["False", ()=>{
                handleAnswerButton("False");
              }]],
              cssClass: screenButtonCss,
            }
          ]}/>,
          [FINISHED]: <Screen items={[
            {
              type: "text",
              text: `You scored ${correctAnsweredQuestions.length}/${totalQuestions}`,
              cssClass: screenTextTitleCss
            },
            {
              type: "list",
              listItems: questions.reduce((curr, {question}) => {
                let validAnswer = false;
                correctAnsweredQuestions.forEach((correctAnsweredQuestion) => {
                  if (correctAnsweredQuestion.question === question) {
                    validAnswer = true;
                  }
                });
                return {
                  ...curr,
                  [question]: validAnswer
                }
              }, {}),
              cssClass: screenTextCss
            },
            {
              type: "button",
              text: "Play Again?",
              cssClass: screenButtonCss,
              callBack: () => {
                reset();
              }
            }
          ]}/>
        }[route]
      }
    </>
  );
}

export default App;
