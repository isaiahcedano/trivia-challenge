const AnswerButtons = ({cssClass, items}) => {
  return (
    <div className={"answers-container"}>
      {
        items.map(([clickEvent, text]) => {
          return <p className={cssClass} onClick={clickEvent}>{text}</p>
        })
      }
    </div>
  )
};

export default AnswerButtons;
