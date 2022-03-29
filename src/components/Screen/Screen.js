import Question from './Question/Question';
import Answers from './Answers/Answers';
import AnswerButtons from './AnswerButtons/AnswerButtons';

const Screen = ({items}) => {
  return (
    <div className={"screen"}>
      {
        items.map(({type,
          text,
          cssClass,
          callBack,
          questionProgress,
          listItems}, index) => {
            if (!text) {
              text = ""
            }

          // For more complex projects, using key as index
          // is not recommended as it can decrease website performance when the elements in specified array get rearranged, as the keys no longer become unique.
          // In this case, we're in the clear because it's a quite simple project :)
            return (
              <>
                {
                  {
                    "text": <p className={`tc ${cssClass}`} key={index}>{text}</p>,

                    "button": <button className={cssClass} onClick={callBack} key={index}>{text}</button>,

                    "question": <Question text={text}
                                          cssClass={cssClass}
                                          current={questionProgress ? questionProgress.current : '...'}
                                          total={questionProgress ? questionProgress.total : '...'}/>,

                    "answer": Array.isArray(text[0]) ? <AnswerButtons cssClass={cssClass} items={[
                        [text[0][1], text[0][0]],
                        [text[1][1], text[1][0]]
                      ]}/> : null,

                    "list": <Answers listItems={listItems} textCssClass={cssClass}/>
                  }[type]
                }
              </>
            );
        })
      }
    </div>
  )
};

export default Screen;
