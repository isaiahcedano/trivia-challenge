import plus from '../../../../plus.png';
import substract from '../../../../substraction.png';

const Answer = ({valid, question, cssClass="", cssClassContainer=""}) => {
  return (
    <div className={cssClass}>
      {
        valid ? <img src={plus} alt={""}/> : <img src={substract} alt={""}/>
      }
      <p className={cssClass}>{question}</p>
    </div>
  );
};

export default Answer;
