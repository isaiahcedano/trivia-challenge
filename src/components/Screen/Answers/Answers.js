import Answer from './Answer/Answer';

const Answers = ({listItems, textCssClass}) => {
  return <div className={"list-answers"}>
    {
      typeof(listItems) !== "undefined" ?
      Object.entries(listItems).map(([question, valid]) =>
        <Answer question={question} valid={valid} cssClass={textCssClass}/>
      ) : null
    }
  </div>
}

export default Answers;
