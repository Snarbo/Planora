

import "./goal-chart.scss";

export function GoalChart() {

  return (
    <div className="goals-chart">
      <div className="goals">
        <div className="goal goal--calories">
          <div className="goal__labels">
            <span className="goal__name">Calories</span>
            <span className="goal__value">1,850/2,000kcal</span>
          </div>
          <progress className="goal__progress"></progress>
          <p className="goal__message">Lorem</p>
        </div>
      </div>
    </div>
  );
}