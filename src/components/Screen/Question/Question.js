const Question = ({text, cssClass, total, current}) => {
  return <div className={"question-container"}>
    <div className={"question"}>
      <p className={cssClass}>{text}</p>
    </div>
    <p className={`question-progress-text ${cssClass}`}>
    {`${current} of ${total}`}</p>
  </div>
};

export default Question;
